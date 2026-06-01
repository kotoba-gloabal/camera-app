"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { translateAccessories, type MessageKey } from "@/lib/i18n";

const INSPECTION_ITEM_KEYS: MessageKey[] = [
  "inspectionLens",
  "inspectionLCD",
  "inspectionPower",
  "inspectionShutter",
  "inspectionFlash",
  "inspectionZoom",
  "inspectionButtons",
  "inspectionLensRetraction",
];

type ProductInspectionTableProps = {
  accessories?: string;
};

export function ProductInspectionTable({ accessories }: ProductInspectionTableProps) {
  const { locale, t } = useLanguage();
  const translatedAccessories = translateAccessories(accessories, locale);
  const accessoriesText = translatedAccessories ?? t("inspectionNoAccessories");

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-[#111827]">{t("inspectionTitle")}</h2>
      <p className="mt-1 text-sm text-[#6B7280]">{t("inspectionSubtitle")}</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2.5 font-medium text-[#6B7280]">{t("inspectionItem")}</th>
              <th className="px-4 py-2.5 text-right font-medium text-[#6B7280]">
                {t("inspectionResult")}
              </th>
            </tr>
          </thead>
          <tbody>
            {INSPECTION_ITEM_KEYS.map((itemKey) => (
              <tr key={itemKey} className="border-t border-gray-100">
                <td className="px-4 py-2.5 text-[#111827]">{t(itemKey)}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-lg font-semibold text-green-600">
                    {t("inspectionPassed")}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 align-top text-[#111827]">{t("inspectionAccessories")}</td>
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
