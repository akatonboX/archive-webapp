import * as Api from "../api";
import { PageLayout } from "../layout/pageLayout";
import { useAxios } from "../lib/axios";
import styles from "./apiPage.module.scss";

export function ApiPage() {
  const axios = useAxios();

  return(
    <PageLayout title="api">
      <div className={styles.root}>
      
        <div>
          <span>me</span>
          <button onClick={async () => {
            console.log("■", await axios.get<Api.Me>("/me"));
          }}>getを実行</button>
          <button onClick={async () => {
            console.log("■", await axios.put<Api.Me>("/me", {
              nickName: "aaa",
              name: "hoge"
            }));
          }}>putを実行→失敗</button>
        </div>
        <div>
          <span>users</span>
          <button onClick={async () => {
            console.log("■", await axios.get<Api.User>("/users"));
          }}>searchを実行</button>
          <button onClick={async () => {
            console.log("■", await axios.get<Api.User>("/users/0"));
          }}>getを実行</button>
           <button onClick={async () => {
            console.log("■", await axios.post<Api.Me>("/users", {
              name: "追加",
            }));
          }}>postを実行</button>
          <button onClick={async () => {
            console.log("■", await axios.put<Api.Me>("/users/0", {
              name: "変更",
            }));
          }}>putを実行</button>
          
        </div>
        <div>
          <span>profile</span>
          <button onClick={async () => {
            console.log("■", await axios.get<Api.Me>("/user/0/profile"));
          }}>getを実行</button>
          <button onClick={async () => {
            console.log("■", await axios.put<Api.Me>("/user/0/profile", {
              nickName: "変更",
            }));
          }}>putを実行→失敗</button>
        </div>
      </div>
    </PageLayout>
  );
}
