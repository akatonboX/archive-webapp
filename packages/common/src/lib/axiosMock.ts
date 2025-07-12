import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";



/**
 * 最も粒度の小さいMock動作を表すインターフェイス。
 */
export interface ApiMock{
  /**
   * モックの名前
   */
  name: string;
  /**
   * 引数のrequestに対し、このMockを実行するかどうかを決定する。ture:実行する /false: 実行しない。
   */
  supports: (request: AxiosRequestConfig) => boolean,
  /**
   * 該当のrequestに対し、動作をエミュレーションして、AxiosResponseを返すメソッド。
   */
  execute: (request: AxiosRequestConfig) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>

  /** APIが実行時間をエミュレーションするミリ秒。あるいはそれを返すメソッド */
  sleep?: number | ((request: AxiosRequestConfig) => number);

}

/**
 * AxiosAdapterBuilderを生成するBuilder
 */
export class AxiosAdapterBuilder{
  private mocks: ApiMock[] = [];
  
  /**
   * Mockを登録する。
   * @param mock 登録するMock
   */
  append(mock: ApiMock){
    //■既に登録されている名前なら無視する。
    if(this.mocks.find(item => item.name === mock.name) != null){
      return;
    } 
    //■追加
    this.mocks.unshift(mock);
  }

  find(name: string){
    return this.mocks.find(item => item.name === name);
  }
  /**
   * AxiosAdapterを作成する。
   * @returns 登録されたMock動作を包括したAxiosAdapter
   */
  build(): AxiosAdapter{
    return ((request: AxiosRequestConfig) => {
      const mock = this.mocks.find(item => item.supports(request));
      const sleep = mock == null || mock.sleep == null ? 200 : typeof mock.sleep === 'number' ? mock.sleep : mock.sleep(request);
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          if(mock != null){
            //■Mockを実行
            const result = await (async () => {
              try{
                return await mock.execute(request);
              }
              catch(exception){
                console.debug("[AxiosMock]Mockの実行時にエラーが発生しました。", mock.name, request.url, request, exception);
                reject(exception);
                return;
              }
            })();

            //■終了
            if(result != null){
              resolve(result);
            }
            else{//Mockが値を返さなければ404を返却
              resolve(
                {
                  status: 404,
                } as AxiosResponse
              )
            }

            //■ログ出力
            console.debug("[AxiosMock]Mockが実行されました。", mock.name, request.url,  request, result);
          }
          else{
            //■処理するMockが見つかれなければ404を返却。
            resolve(
              {
                status: 404,
              } as AxiosResponse
            )

            //■ログ出力
            console.debug("[AxiosMock]Mockが見つからなかったので404を返却します。", request.url,  request);
          }
        }, sleep);
      });
    });
  }
}