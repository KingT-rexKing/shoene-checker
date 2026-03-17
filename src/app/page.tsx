import Checker from "@/components/Checker";

export default function Home() {
  return (
    <div>
      {/* 页面标题和说明 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          仕様基準 適合診断
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          2025年4月より、原則すべての新築建築物に省エネ基準への適合が義務化されました。
          本ツールでは、木造戸建住宅の仕様基準（簡易な判定ルート）への適合を簡単にチェックできます。
        </p>
      </div>

      {/* 核心组件：问答+判定 */}
      <Checker />

      {/* 补充说明 */}
      <div className="mt-12 space-y-6 text-sm text-gray-500">
        <div>
          <h3 className="font-bold text-gray-700 mb-1">仕様基準とは？</h3>
          <p className="leading-relaxed">
            仕様基準は、あらかじめ国が定めた断熱材や窓の基準仕様に従うことで、
            複雑な省エネ計算なしで省エネ基準への適合を確認できる簡易的な方法です。
          </p>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-1">このツールについて</h3>
          <p className="leading-relaxed">
            本ツールはオープンソースプロジェクトです。コードはGitHubで公開されており、
            どなたでも自由にご利用・改善いただけます。計算ロジックは完全に透明です。
          </p>
        </div>
      </div>
    </div>
  );
}
