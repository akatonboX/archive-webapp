import { Anchor } from "../common/component/anchor";
import { PageLayout } from "../layout/pageLayout";
import styles from "./anchorPage.module.scss";

export function AnchorPage(
  props:{
    title: string,
  }
) {
  return(
    <PageLayout title={props.title}>
      <div className={styles.root}>
        <div>
          <span>ドメインを指定</span>
          <Anchor href="http://www.yahoo.co.jp/">yahoo(targetなし)</Anchor>
          <Anchor href="http://www.yahoo.co.jp/" target="_blank">yahoo(targeあり)</Anchor>
        </div>
        <div>
          <span>絶対パス</span>
          <Anchor href="/anchor/page1">page1(targetなし)</Anchor>
          <Anchor href="/anchor/page2">page2(targetなし)</Anchor>
          <Anchor href="/anchor/page1" target="_blank">page1(targeあり)</Anchor>
          <Anchor href="/anchor/page2" target="_blank">page2(targeあり)</Anchor>
        </div>
        <div>
          <span>相対パス</span>
          <Anchor href="../page1">page1(targetなし)</Anchor>
          <Anchor href="../page2">page2(targetなし)</Anchor>
          <Anchor href="../page1" target="_blank">page1(targeあり)</Anchor>
          <Anchor href="../page2" target="_blank">page2(targeあり)</Anchor>
        </div>
      </div>
    </PageLayout>
  );
}