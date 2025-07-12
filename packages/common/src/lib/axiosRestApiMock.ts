/**
 * Rest APIのAxiosMockを作成するためのヘルパーです。
 * "./axiosMock.ts"を拡張し、以下の前提で簡単にRestAPIのMockを作れるようにしています。
 * Rest APIを"single", "multi"の動作ケースに分けています。
 * ■single
 * 　単一のリソースを操作するAPI。
 * 　識別子となるパスパラメータはサポートせず、search(一覧取得のget),post,deleteをサポートしません。
 * ■multi
 * 　複数リソースを操作するAPI
 * 　識別子となるパスパラメータをサポートし、search,post,deleteもサポートします。
 */

import { AxiosHeaders, type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { ApiMock } from "./axiosMock";
import { cloneDeep } from "lodash";



/**
 * 処理の種類。
 */
export type ActionType = "get" | "post" | "put" | "delete" | "search";


export interface RestApiMockRequestInfo<T_RESOURCE>{
  resource?: T_RESOURCE;
  actionType: ActionType;
  url: URL;
  pathParameters: Record<string, string | number>;
  pathParameterInfos: PathParameterInfo[];
  request: AxiosRequestConfig;
}

export type PathParameterInfo =  {name: string, type: "string" | "number"};
/**
 * リソースのMock動作を決定するOption
 */
 interface ResourceMockOption<T_RESOURCE, T_DATA>{
  
  data: T_DATA[];

  /**
   * リソースのパスを指定します。例えば"/users"や"/users/{id}/profile"(サブリソース)など。パスパラメータは、{}で表現して下さい。
   * また、パスパラメータに型を指定することが可能です。"/users/{id:number}"は、number型のidとして解釈します。省略した場合はstringです。
   * また、パスパラメータの名前は、T_RESOURCEのプロパティに対応する名前してください。動作の自動化につながります。
   */
  resourcePath: string;

  /**
   * サポートするアクションを指定します。"get" | "post" | "put" | "delete" | "search"のいずれかです。
   */
  supportedActionTypes?: ActionType[];

  /**
   * putの場合、作成を許すかどうか。省略した場合は許可。
   */
  allowCreateWhenPut?: boolean;

  
  /**
   * リクエストの情報をもとに、対象のデータを検索し、そのindexを返します。
   * get, put, deleteで利用されます。
   * 見つからない場合は、undefiendを返してください。
   * 省略した場合は、パスパラメータが一致するindexを探します。
   * 
   * @param data 検索対象のデータの集合
   * @param requestInfo リクエストの情報
   * @return 見つかったdataのindex。見つからない場合は、undefined
   */
  find?: (data: T_DATA[], requestInfo: RestApiMockRequestInfo<T_RESOURCE>) => number | undefined;

  /**
  * リクエストの情報をもとに、対象のデータを作成します。
  * postまたは、putによる作成時に使用されます。
  * 省略した場合は、リクエストボディが"as T"で変換したうえ、パスパラメータを同名のプロパティに設定します。
  * @param requestInfo リクエストの情報
  * @param data 現在のデータ。シーケンス的な実装のために提供されます。
  * @returns 作成したデータ。現在のデータに追加されます。
  */
  create?: (requestInfo: RestApiMockRequestInfo<T_RESOURCE>, data: T_DATA[]) => T_DATA;


  /**
   * リクエストの情報をもとに、対象のデータを更新します。
   * putによる更新時に使用されます。
   * 省略した場合は、リクエストボディが"as T"で変換したうえ、パスパラメータを同名のプロパティに設定します。
   * 省略した場合、リクエストボディの
   * @param target 更新対象のデータ
   * @param requestInfo リクエストの情報
   * @returns 更新したデータ。現在のデータと差し替えられます。
   */
  update?: (target: T_DATA, requestInfo: RestApiMockRequestInfo<T_RESOURCE>, data: T_DATA[]) => T_DATA;

  /**
   * 内部データ形式をAPIのリソースの形式に直します。指定がない場合、同じ形とみなしてそのまま返却します。
   */
  convert?: (data: T_DATA) => T_RESOURCE;
  
  /** APIが実行時間をエミュレーションするミリ秒。あるいはそれを返すメソッド */
  sleep?: number | ((request: AxiosRequestConfig) => number);

    /**
   * 標準動作で生成されたresponseを書き換えるためのカスタマイズメソッド
   * 不要な場合は、undefined。
   * @param request 処理対象のリクエスト
   * @param actionType 処理対象のアクションの種類
   * @param url 処理対象のリクエストのURL
   * @next  デフォルトの処理を実行するメソッド
   */
   intercept?: (requestInfo: RestApiMockRequestInfo<T_RESOURCE>, next: (request: AxiosRequestConfig) => AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;

}

/**
 * シングルトンリソースのMock動作を決定するOption
 */
interface SingletonResourceMockOption<T_RESOURCE, T_DATA> extends ResourceMockOption<T_RESOURCE, T_DATA>{

}
/**
 *  MultiRestApiMockの動作を決定するプロパティ
 */
interface CollectionResourceMockOption<T_RESOURCE, T_DATA> extends ResourceMockOption<T_RESOURCE, T_DATA>{
  
  /**
   * データからキー(識別子)を抽出します。post,putのlocation作成に利用されます。
   * 省略した場合は、uuidを用います。
   */
  // getKey?: (data: T_DATA) => string;

  /**
   * このリソースの識別子となるパスパラメータの情報
   */
  pathParameter: PathParameterInfo;
  /**
   * pagenationを利用する場合に設定します。設定がある場合、searchの戻り値を制限します。また、content-rangeヘッダを付与します。
   */
  pagenationSettings?: {
    limitParameterName?: string;
    offsetParameterName?: string;
    defaultLimit: number;
  };


  /**
   * 検索条件に一致しるデータだけにfilterする。
   * searchで利用されます。
   * 省略した場合、どんなリクエストパラメータであっても、全件返します。
   * searchをサポートしない場合は、設定する必要がありません。
   * @param data 検索対象のデータの集合
   * @param request  検索条件を含んだリクエスト
   * @return 見つかったdataの集合
   */
  filter?: (data: T_DATA[], requestInfo: RestApiMockRequestInfo<T_RESOURCE>) => T_DATA[];

}

/**
 * シングルトン、コレクションの双方のリソースのためのApiMockの実装の共通部分。
 */
 abstract class ResourceApiMock<T_RESOURCE, T_DATA, T_OPTION extends ResourceMockOption<T_RESOURCE, T_DATA>> implements ApiMock{
  data: T_DATA[];
  protected option: T_OPTION;
  /** APIが実行時間をエミュレーションするミリ秒。あるいはそれを返すメソッド */
  sleep?: number | ((request: AxiosRequestConfig) => number);

  /** 実際のurlがこれにマッチしたときに自身が対応するリクエストとする */
  pathParameterInfos: PathParameterInfo[] = [];
  resourcePathRegExp: RegExp;

  constructor(option: T_OPTION){
    this.option = option;
    this.data = option.data;
    this.name = option.resourcePath;
    
    this.sleep = option.sleep;

    //■resourcePathからresourcePathRegExpとpathParameterNamesを生成
    const resourcePathRegExpSource = option.resourcePath
                                .split('/')
                                .map(part => {
                                  if (part.startsWith('{') && part.endsWith('}')) {//パスパラメータと認識
                                    const value = part.slice(1, -1);
                                    const pathParameter: PathParameterInfo = (() => {
                                      if(value.includes(":")){//型指定を含む
                                        const temp = value.split(":").map(item => item.trim());
                                        if(temp[1] !== "string" && temp[1] !== "number") throw Error(`[AxiosRestApiMock]resourcePathに指定されたパラメータが不正です。parameter=${value}`)
                                        return {name: temp[0], type: temp[1]};
                                      }
                                      else{//型指定はない→型はstringにする
                                        return {name: value, type: "string"};
                                      }
                                    })();
                                    this.pathParameterInfos.push(pathParameter);
                                    return '[^/]+'; // パスパラメータ（スラッシュを含まない文字列）
                                  } else {
                                    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 固定パートをエスケープ
                                  }
                                })
                                .join('/');
    this.resourcePathRegExp = new RegExp(`${resourcePathRegExpSource}$`);
  }
 

  name: string;

  async execute(request: AxiosRequestConfig<any>) : Promise<AxiosResponse<any, any>>{

    //■URLの取得
    if(request.url == null)throw Error("[AxiosRestApiMock]request.urlに値がありません。");
    const requestUrl = new URL(request.url, request.baseURL);

    //■アクションタイプの取得
    const actionType = this.getActionType(request);
    if(actionType == null)throw Error("[AxiosRestApiMock]actionTypeがundifinedです。");

    //■サポートされたアクションタイプかどうかの判断    
    if(
      this.option.supportedActionTypes != null && this.option.supportedActionTypes.indexOf(actionType) < 0){
        console.debug(`[AxiosRestApiMock]サポートされていないmethodか、リクエストが不正です。actionType=${actionType}, supportedActionTypes=${this.option.supportedActionTypes}`);
        return {
          status: 500,
        } as AxiosResponse;
    }

    //■パスパラメータの取得
    const pathParameters = (() => {
      const result: Record<string, string | number> = {};
      const match = requestUrl.pathname.match(this.resourcePathRegExp);
      if (match == null) return result;
      const values = match.slice(1);
      this.pathParameterInfos.forEach((pathParameterInfo, index) => {
        if(index < values.length){//コレクションリソースでは、一つ減る可能性あり
          result[pathParameterInfo.name] = pathParameterInfo.type === "number" ? Number(values[index]) : values[index];
        }
      });
      return result; 
    })();

    //■リソースの取得
    const resourceJson = (request.data == null || request.data.trim().length === 0) ? undefined : request.data;
    const [resource, hasError] = (() => {
      if(resourceJson != null){
        try{
          return [JSON.parse(resourceJson), false];
        }
        catch(e){
          return [undefined, true];
        }
      }
      else{
        return [undefined, false];
      }
    })();
    if(hasError){
      console.debug(`[AxiosRestApiMock]response bodyのJsonに問題があります。`, resourceJson);
      return {
          status: 400,
      } as AxiosResponse;
    }
   
    //■requestIfoの構築
    const requestInfo: RestApiMockRequestInfo<T_RESOURCE> = {
      resource: resource as T_RESOURCE,
      actionType: actionType,
      url: requestUrl,
      pathParameters: pathParameters,
      pathParameterInfos: this.pathParameterInfos,
      request: request,
    }


    const intercept = this.option.intercept 
      ?? ((requestInfo, next) => {
        return next(requestInfo.request);
      });

    const result = await intercept(requestInfo, (_request) => this.innerExecute(requestInfo));
    return result;
  }

  abstract supports(request: AxiosRequestConfig): boolean;

  /**
   * リクエストのActionTypeを判別する。
   * ただし、サポートしないアクションタイプであっても返却する。
   * @param request 
   */
  protected abstract getActionType(request: AxiosRequestConfig<any>): "search" | "get" | "post" | "put" | "delete" | undefined;
  
  /**
   * 実際の処理。
   * @param request 
   */
  protected innerExecute(requestInfo: RestApiMockRequestInfo<T_RESOURCE>): AxiosResponse{
    
    //■メソッド定義。※javascriptのthisは呼び出しもとに依存するので注意。 this.option.find ?? this.findDefaultでは、findDefault内のthisがundefeindになる。
    const find = this.option.find ?? ((data: T_DATA[], requestInfo: RestApiMockRequestInfo<T_RESOURCE>) => this.findDefault(data, requestInfo));
    const create = this.option.create ?? ((requestInfo: RestApiMockRequestInfo<T_RESOURCE>, data: T_DATA[]) => this.createDefault(requestInfo, data));
    const update = this.option.update ?? ((target: T_DATA, requestInfo: RestApiMockRequestInfo<T_RESOURCE>, data: T_DATA[]) => this.updateDefault(target, requestInfo, data));

    switch(requestInfo.actionType){
      case "get": 
        {
          const index = find(this.data, requestInfo);
          if(index == null || index < 0){
            return {
              status: 404,
            } as AxiosResponse;
          }
          else{
            const data = this.data[index];
            return {
              data: this.option.convert == null ? data : this.option.convert(data),
              status: 200,
            } as AxiosResponse;
          }
        }
      case "post": 
        {
          if(requestInfo.resource == null){
            console.debug("[AxiosRestApiMock]postメソッドにもかかわらず、request bodyがありません。");
            return {
              status: 400,
            } as AxiosResponse;
          }
          const data = create(requestInfo, this.data);
          this.data.push(data);
          return {
            data: this.option.convert == null ? data : this.option.convert(data),
            status: 201,
          } as AxiosResponse;
        }
      case "put":
        {
          if(requestInfo.resource == null){
            console.debug("[AxiosRestApiMock]putメソッドにもかかわらず、request bodyがありません。");
            return {
              status: 400,
            } as AxiosResponse;
          }
          const index = find(this.data, requestInfo);
          if(index == null || index < 0){//新規作成
            if(this.option.allowCreateWhenPut ?? true){
              const data = create(requestInfo, this.data);
              this.data.push(data);
              return {
                data: this.option.convert == null ? data : this.option.convert(data),
                status: 201,
              } as AxiosResponse;
            }
            else{
              console.debug(`[AxiosRestApiMock]allowCreateWhenPut=falseのリソースにputされました。`);
              return {
                status: 500,
              } as AxiosResponse;
            }
          }
          else{//更新
            const data = update(this.data[index], requestInfo, this.data);
            this.data[index] = data;
            return {
              data: this.option.convert == null ? data : this.option.convert(data),
              status: 200,
            } as AxiosResponse;
          }
        }
      case "delete":
        {
          const index = find(this.data, requestInfo);
          if(index == null || index < 0){
            return {
              status: 404,
            } as AxiosResponse;
          }
          else{
            this.data = this.data.filter((_, itemIndex) => itemIndex !== index);
            return {
              status: 204,
            } as AxiosResponse;
          }
        }
      default:
        throw new Error(`[AxiosRestApiMock]未知のtypeです。type=${requestInfo.actionType}`);
    }
  }

  protected findDefault(data: T_DATA[], requestInfo: RestApiMockRequestInfo<T_RESOURCE>){
    return data.findIndex(item => {
      let result = true;
      for (const [key, value] of Object.entries(requestInfo.pathParameters)) {
        if((item as any)[key] !== value){
          result = false;
          break;
        }
      }
      return result;
    });
  }
  protected createDefault(requestInfo: RestApiMockRequestInfo<T_RESOURCE>, data: T_DATA[]){
    const result = cloneDeep(requestInfo.resource) as T_DATA;
    for (const [key, value] of Object.entries(requestInfo.pathParameters)) {
      (result as any)[key] = value;
    }
    return result;
  }
  protected updateDefault(target: T_DATA, requestInfo: RestApiMockRequestInfo<T_RESOURCE>, _data: T_DATA[]){
    if(requestInfo.resource != null){
      for (const [key, value] of Object.entries(requestInfo.resource)) {
        if(requestInfo.pathParameterInfos.find(item => item.name === key) == null){//キー項目(パスパラメータ)は更新しない
          (target as any)[key] = value;
        }
      }
    }
    return target;
  }
}

/**
 * 一つのリソースに対する操作を行うAPIのMock。
 */
export class SingletonResourceApiMock<T_RESOURCE, T_DATA = T_RESOURCE> extends ResourceApiMock<T_RESOURCE, T_DATA, SingletonResourceMockOption<T_RESOURCE, T_DATA>>{

  constructor(option: SingletonResourceMockOption<T_RESOURCE, T_DATA>){
    super(option);
    this.data = option.data;
  }
  protected getActionType(request: AxiosRequestConfig<any>): "get" | "post" | "put" | "delete" | undefined {
    //■入力チェック
    if(request.method == null)throw Error("[AxiosRestApiMock]request.methodに値がありません。");

    const requestMethod = (() => {
      const method = request.method.toLowerCase();
      return ["get", "post", "put", "delete"].indexOf(method) < 0 ? undefined : method as "get" | "post" | "put" | "delete";
    })();
    return requestMethod;
  }

  supports(request: AxiosRequestConfig<any>){
    
    //■リクエストにurlがなければ処理しない。
    if(request.url == null) return false;

    //■パスパターンが一致することの確認
    const requestUrl = new URL(request.url, request.baseURL);
    return this.resourcePathRegExp.test(requestUrl.pathname);
  }
}

/**
 * 複数のリソースに対する捜査を行うAPIのMock。
 */
 export class CollectionResourceApiMock<T_RESOURCE, T_DATA = T_RESOURCE> extends ResourceApiMock<T_RESOURCE, T_DATA, CollectionResourceMockOption<T_RESOURCE, T_DATA>>{
  resourceItemPathRegExp: RegExp;
  
  constructor(option: CollectionResourceMockOption<T_RESOURCE, T_DATA>){

    super(option);
    this.data = option.data;
    //■resourceItemPathRegExpの構築
    //※resourcePathRegExpから末尾の"$"を削除して、パラメータを追加
    this.resourceItemPathRegExp = new RegExp(`${this.resourcePathRegExp.source.slice(0, -1)}/([^/]+)$`);
    this.pathParameterInfos.push(option.pathParameter);

  }
  supports(request: AxiosRequestConfig<any>){
    //■リクエストにurlがなければ処理しない。
    if(request.url == null) return false;

    //■パスパターンが一致することの確認
    const requestUrl = new URL(request.url, request.baseURL);
    return this.resourcePathRegExp.test(requestUrl.pathname) || this.resourceItemPathRegExp.test(requestUrl.pathname);
  }

  protected getActionType(request: AxiosRequestConfig<any>): ActionType | undefined {
    //入力チェック
    if(request.url == null)throw Error("[AxiosRestApiMock]request.urlに値がありません。");
    if(request.method == null)throw Error("[AxiosRestApiMock]request.methodに値がありません。");

    const requestUrl = new URL(request.url, request.baseURL);
    const requestMethod = (() => {
      const method = request.method.toLowerCase();
      return ["get", "post", "put", "delete"].indexOf(method) < 0 ? undefined : method as "get" | "post" | "put" | "delete";
    })();

    const actionType = (() => {
      switch(requestMethod){
        case "get": return this.resourceItemPathRegExp.test(requestUrl.pathname) ? "get" : "search";
        default: return requestMethod;
      }
    })();
    
    return actionType;  
  }

  protected innerExecute(requestInfo: RestApiMockRequestInfo<T_RESOURCE>): AxiosResponse{
    switch(requestInfo.actionType){
      case "search": 
        {
          const data = this.option.filter != null ? this.option.filter(this.data, requestInfo) : this.data;
          if(this.option.pagenationSettings != null){
            const pagenationSetting = this.option.pagenationSettings;
            const [offset, limit] = (() => {   
              const offsetParam = requestInfo.url.searchParams.get(pagenationSetting.offsetParameterName ?? "offset");
              const limitParam = requestInfo.url.searchParams.get(pagenationSetting.limitParameterName ?? "limit");
              return [
                offsetParam == null ? 0 : Number(offsetParam),
                limitParam == null ? pagenationSetting.defaultLimit : Number(limitParam),
              ]
            })();

            const pagedData = data.filter((_, index) => index >= offset && index < offset + limit);
            const headers = new AxiosHeaders();
            headers.set("content-range", `items ${offset}-${offset + limit - 1}/${data.length}`);
            return {
              headers: headers.toJSON(),
              data: pagedData.length === 0 ? undefined : pagedData.map(item => this.option.convert == null ? item : this.option.convert(item)),
              status: pagedData.length === 0 ? 204 : 200,
            } as AxiosResponse;
          }
          else{
            return {
              data: data.length === 0 ? undefined : data.map(item => this.option.convert == null ? item : this.option.convert(item)),
              status: data.length === 0 ? 204 : 200,
            } as AxiosResponse;
          }
        }
      default:
        return super.innerExecute(requestInfo);
    }
  }  

  protected createDefault(requestInfo: RestApiMockRequestInfo<T_RESOURCE>, data: T_DATA[]){
    const result = super.createDefault(requestInfo, data);
    //■識別子の設定
    const newIndex = data.length;
    console.log("★", this)
    const pathParameterInfo = this.pathParameterInfos[this.pathParameterInfos.length - 1];//最後が自身の識別子
    (result as any)[pathParameterInfo.name] = pathParameterInfo.type === "number" ? newIndex : String(newIndex);
    return result;
  }
}


/**
 * シングルトンリソースのApiMockを作成します。
 * @param name 
 * @param props 
 * @returns 
 */
export function createSingletonResourceApiMock<T_RESOURCE, T_DATA>(option: SingletonResourceMockOption<T_RESOURCE, T_DATA>): ApiMock{
  return new SingletonResourceApiMock(option);
}
/**
 * コレクションリソースのApiMockを作成します。
 * @param name 
 * @param props 
 * @returns 
 */
 export function createCollectionResourceApiMock<T_RESOURCE, T_DATA>(option: CollectionResourceMockOption<T_RESOURCE, T_DATA>): ApiMock{
  return new CollectionResourceApiMock(option);
}