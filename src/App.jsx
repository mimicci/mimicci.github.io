import { useState, useRef } from 'react';
import './App.css';  // ← CSSファイルをインポート

function App() {
  // テーブルのデータ
  const [items] = useState([
    { id: 1, name: 'ピッツェリア　バー3' },
    { id: 2, name: 'たまに屋　荻窪店' },
    { id: 3, name: 'シカゴピッツァ' },
    { id: 4, name: '農家の台所' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  // ランダム選択アニメーション
  const startRandomSelection = () => {
    // 既にアニメーション中なら何もしない
    if (isAnimating) return;

    // アニメーション開始
    setIsAnimating(true);
    setSelectedItem(null);

    // 最終的に選ばれるインデックスを先に決定
    const finalIndex = Math.floor(Math.random() * items.length);
    
    let counter = 0;
    let speed = 50; // 初期速度（ミリ秒）
    const totalSteps = 30 + Math.floor(Math.random() * 20); // 30-50回ループ

    // アニメーション関数（再帰的に実行）
    const animate = () => {
      intervalRef.current = setTimeout(() => {
        // 現在の行インデックスを計算（循環）
        const nextIndex = counter % items.length;
        setCurrentIndex(nextIndex);
        counter++;

        // 徐々に速度を落とす（減速効果）
        if (counter > totalSteps - 10) {
          speed += 30; // 最後は大きく減速
        } else if (counter > totalSteps - 20) {
          speed += 15; // 中盤から減速
        } else {
          speed += 2; // 序盤は少しずつ減速
        }

        // まだ続けるなら再帰呼び出し
        if (counter < totalSteps) {
          animate();
        } else {
          // アニメーション終了：最終的な選択結果を設定
          setCurrentIndex(finalIndex);
          setSelectedItem(items[finalIndex]);
          setIsAnimating(false);
        }
      }, speed);
    };

    // アニメーション開始
    animate();
  };

  return (
    <div className="app-container">
      <div className="content">
        {/* タイトル */}
        <h1 className="title">🎰 ルーレット式ランダム選択</h1>
        <p className="subtitle">
          ボタンを押すと行をかけめぐって最終的に1つを選択します
        </p>

        {/* スタートボタン */}
        <div className="button-container">
          <button
            onClick={startRandomSelection}
            disabled={isAnimating}
            className={`start-button ${isAnimating ? 'disabled' : ''}`}
          >
            {isAnimating ? '🎲 選択中...' : '🎯 スタート！'}
          </button>
        </div>

        {/* 選択結果の表示 */}
        {selectedItem && !isAnimating && (
          <div className="result-box">
            <p className="result-title">
              🎉 選択されたのは。。。 {selectedItem.name}　です！！🏬
            </p>
          </div>
        )}

        {/* テーブル */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名前</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    currentIndex === index && isAnimating
                      ? 'row-animating'      // アニメーション中の行
                      : selectedItem?.id === item.id && !isAnimating
                      ? 'row-selected'       // 最終選択された行
                      : ''                   // 通常の行
                  }
                >
                  <td>{item.id}</td>
                  <td>
                    {currentIndex === index && isAnimating && '👉 '}
                    {item.name}
                    {selectedItem?.id === item.id && !isAnimating && ' 🎊'}
                  </td>
                  <td>{item.category}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 実装のポイント */}
        <div className="info-box">
          <h2 className="info-title">💡 実装のポイント</h2>
          <ul className="info-list">
            <li>
              <strong>setTimeout</strong>を使って一定間隔で行を切り替え
            </li>
            <li>
              <strong>速度を徐々に遅く</strong>してルーレット効果を演出
            </li>
            <li>
              <strong>useRef</strong>でタイマーIDを管理してクリーンアップ
            </li>
            <li>
              アニメーション中は<strong>ボタンを無効化</strong>して重複実行を防止
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;