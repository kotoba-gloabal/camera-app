const INSPECTION_ITEMS = [
  "レンズ",
  "液晶",
  "電源",
  "シャッター",
  "フラッシュ",
  "ズーム",
  "ボタン反応",
  "レンズ格納",
] as const;

type ProductInspectionTableProps = {
  accessories?: string;
};

export function ProductInspectionTable({ accessories }: ProductInspectionTableProps) {
  const accessoriesText = accessories?.trim() ? accessories.trim() : "-";

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-[#111827]">動作確認</h2>
      <p className="mt-1 text-sm text-[#6B7280]">Basic functional inspection before listing.</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2.5 font-medium text-[#6B7280]">確認項目</th>
              <th className="px-4 py-2.5 text-right font-medium text-[#6B7280]">結果</th>
            </tr>
          </thead>
          <tbody>
            {INSPECTION_ITEMS.map((item) => (
              <tr key={item} className="border-t border-gray-100">
                <td className="px-4 py-2.5 text-[#111827]">{item}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-lg font-semibold text-green-600">〇</span>
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 align-top text-[#111827]">付属品</td>
              <td className="whitespace-pre-wrap break-words px-4 py-2.5 text-right text-gray-700">
                {accessoriesText}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
