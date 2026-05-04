import { useRef } from "react";
import { Upload, Calendar } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@sgx/ui";
import { useBacktest } from "@/contexts/BacktestContext";
import { CustomDropdown } from "@/components/CustomDropdown";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { BASE_CURRENCY_OPTIONS, CALENDAR_OPTIONS, TYPE_OPTIONS } from "@sgx/shared";
import { ReturnTypeSelector } from "./ReturnTypeSelector";
import { DecrementConfigSection } from "./DecrementConfigSection";
import { CalendarSelector } from "./CalendarSelector";
import { ParameterSelectors } from "./ParameterSelectors";

export function BacktestConfigStep() {
  const { universes, filterSets, rankingRules, weightingConfigurations } =
    useBacktest();
  const { control, setValue, watch } = useFormContext<CreateIndexFormState>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const indexType = watch("indexType");
  const returnTypes = watch("returnTypes");
  const uploadedFile = watch("uploadedFile") as File | null;
  const uploadedFileName = watch("uploadedFileName");
  const backtestStartDate = watch("backtestStartDate");
  const decrementFrequency = watch("decrementFrequency");
  const decrementBasis = watch("decrementBasis");
  const customDays = watch("customDays");
  const totalPoints = watch("totalPoints");
  const totalPercentage = watch("totalPercentage");

  const universeOptions = universes.map((u) => u.universeName);
  const filterOptions = filterSets.map((f) => f.name);
  const rankingOptions = rankingRules.map((r) => r.name);
  const weightingOptions = weightingConfigurations.map((w) => w.name);

  const showDecrementFields =
    returnTypes.decrementPoints || returnTypes.decrementPercent;
  const isFixedBasket = indexType.includes("Fixed Basket");
  const todayISO = new Date().toISOString().split("T")[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("uploadedFile", file, { shouldDirty: true });
    setValue("uploadedFileName", file?.name ?? null, { shouldDirty: true });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg" style={{ color: "#0B236B" }}>
        Backtest Configuration
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="backtestName"
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                Backtest Name
              </label>
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
                style={{
                  borderColor: fieldState.error ? "#EF4444" : "#D1D5DB",
                  color: "#0B236B",
                }}
                placeholder="e.g., APAC ESG Leaders Q1 2026 Test Run"
              />
              {fieldState.error ? (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {fieldState.error.message}
                </p>
              ) : (
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Descriptive name for this backtest scenario
                </p>
              )}
            </div>
          )}
        />

        <FormField
          control={control}
          name="indexType"
          render={({ field }) => (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                Index Type
              </label>
              <CustomDropdown
                options={TYPE_OPTIONS.filter((o) => o.value !== "ALL").map(
                  (o) => o.label,
                )}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  if (val.includes("Fixed Basket")) {
                    setValue("selectedUniverse", "");
                    setValue("selectedFilters", "");
                    setValue("selectedRanking", "");
                    setValue("selectedWeighting", "");
                  } else {
                    setValue("uploadedFile", null);
                    setValue("uploadedFileName", null);
                  }
                }}
                placeholder="Select index type"
              />
              {isFixedBasket && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors hover:bg-blue-50"
                    style={{ borderColor: "#0094B3", color: "#0094B3" }}
                  >
                    <Upload size={14} />
                    Upload File
                  </button>
                  {uploadedFile || uploadedFileName ? (
                    <span
                      className="text-sm truncate max-w-45"
                      style={{ color: "#374151" }}
                      title={uploadedFile?.name ?? uploadedFileName ?? ""}
                    >
                      {uploadedFile?.name ?? uploadedFileName}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      .csv
                    </span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          )}
        />
      </div>

      <FormField
        control={control}
        name="returnTypes"
        render={({ field, fieldState }) => (
          <div>
            <ReturnTypeSelector
              returnTypes={field.value as ReturnTypes}
              onToggle={(type) => {
                const current = field.value as ReturnTypes;
                let updated: ReturnTypes;
                if (type === "decrementPoints") {
                  updated = {
                    ...current,
                    decrementPoints: !current.decrementPoints,
                    decrementPercent: false,
                  };
                } else if (type === "decrementPercent") {
                  updated = {
                    ...current,
                    decrementPercent: !current.decrementPercent,
                    decrementPoints: false,
                  };
                } else {
                  updated = { ...current, [type]: !current[type] };
                }
                field.onChange(updated);
              }}
            />
            {fieldState.error && (
              <p className="text-xs mt-2" style={{ color: "#EF4444" }}>
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {showDecrementFields && (
        <div className="opacity-40 pointer-events-none select-none">
          <DecrementConfigSection
            returnTypes={returnTypes}
            decrementFrequency={decrementFrequency}
            decrementBasis={decrementBasis}
            customDays={customDays}
            totalPoints={totalPoints}
            totalPercentage={totalPercentage}
            onChange={(updates) => {
              if (updates.decrementFrequency !== undefined)
                setValue("decrementFrequency", updates.decrementFrequency, { shouldDirty: true });
              if (updates.decrementBasis !== undefined)
                setValue("decrementBasis", updates.decrementBasis, { shouldDirty: true });
              if (updates.customDays !== undefined)
                setValue("customDays", updates.customDays, { shouldDirty: true });
              if (updates.totalPoints !== undefined)
                setValue("totalPoints", updates.totalPoints, { shouldDirty: true });
              if (updates.totalPercentage !== undefined)
                setValue("totalPercentage", updates.totalPercentage, { shouldDirty: true });
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="backtestStartDate"
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                Backtest Start Date <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#6B7280" }}
                />
                <input
                  {...field}
                  type="date"
                  max={todayISO}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
                  style={{
                    borderColor: fieldState.error ? "#EF4444" : "#D1D5DB",
                    color: "#0B236B",
                  }}
                />
              </div>
              {fieldState.error ? (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {fieldState.error.message}
                </p>
              ) : (
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Historical start date for backtesting — index base date
                </p>
              )}
            </div>
          )}
        />

        <FormField
          control={control}
          name="backtestEndDate"
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                Backtest End Date <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#6B7280" }}
                />
                <input
                  {...field}
                  type="date"
                  min={backtestStartDate || undefined}
                  max={todayISO}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
                  style={{
                    borderColor: fieldState.error ? "#EF4444" : "#D1D5DB",
                    color: "#0B236B",
                  }}
                />
              </div>
              {fieldState.error ? (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {fieldState.error.message}
                </p>
              ) : (
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  End date for backtest calculation (latest available date)
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="baseCurrency"
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                Base Currency <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <CustomDropdown
                options={BASE_CURRENCY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select base currency"
              />
              {fieldState.error && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <FormField
          control={control}
          name="baseValue"
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                Base Value <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
                style={{
                  borderColor: fieldState.error ? "#EF4444" : "#D1D5DB",
                  color: "#0B236B",
                }}
                placeholder="Enter base value"
              />
              {fieldState.error && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <FormField
        control={control}
        name="selectedCalendars"
        render={({ field }) => (
          <CalendarSelector
            calendarOptions={CALENDAR_OPTIONS}
            selectedCalendars={field.value as string[]}
            onToggle={(calendar) => {
              const current = field.value as string[];
              const updated = current.includes(calendar)
                ? current.filter((c) => c !== calendar)
                : [...current, calendar];
              field.onChange(updated);
            }}
          />
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <div>
            <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
              Description
            </label>
            <textarea
              {...field}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
              style={{ borderColor: "#D1D5DB", color: "#0B236B" }}
              placeholder="Describe the backtest purpose, methodology notes, or any specific testing objectives..."
            />
          </div>
        )}
      />

      <ParameterSelectors
        universeOptions={universeOptions}
        filterOptions={filterOptions}
        rankingOptions={rankingOptions}
        weightingOptions={weightingOptions}
        isFixedBasket={isFixedBasket}
      />
    </div>
  );
}
