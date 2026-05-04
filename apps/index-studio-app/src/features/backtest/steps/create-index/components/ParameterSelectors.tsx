import { useFormContext } from "react-hook-form";
import { FormField } from "@sgx/ui";
import { CustomDropdown } from "@/components/CustomDropdown";
import { CreateIndexFormState } from "@/features/backtest/types";

interface ParameterSelectorsProps {
  universeOptions: string[];
  filterOptions: string[];
  rankingOptions: string[];
  weightingOptions: string[];
  isFixedBasket: boolean;
}

export function ParameterSelectors({
  universeOptions,
  filterOptions,
  rankingOptions,
  weightingOptions,
  isFixedBasket,
}: ParameterSelectorsProps) {
  const { control, watch, setValue } = useFormContext<CreateIndexFormState>();
  const selectedUniverse = watch("selectedUniverse");

  return (
    <div className="border-t pt-6" style={{ borderColor: "#E5E7EB" }}>
      <h3 className="text-md mb-4" style={{ color: "#0B236B" }}>
        Select Parameters
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className={isFixedBasket ? "opacity-50 pointer-events-none" : ""}>
          <FormField
            control={control}
            name="selectedUniverse"
            render={({ field }) => (
              <>
                <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                  Universe
                </label>
                <CustomDropdown
                  options={universeOptions}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("selectedFilters", "");
                  }}
                  placeholder="Select universe"
                  disabled={isFixedBasket}
                />
                {isFixedBasket && (
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Not applicable for Fixed Basket
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className={isFixedBasket ? "opacity-50 pointer-events-none" : ""}>
          <FormField
            control={control}
            name="selectedFilters"
            render={({ field }) => (
              <>
                <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                  Filters
                </label>
                <CustomDropdown
                  options={filterOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select filters"
                  disabled={isFixedBasket || !selectedUniverse}
                />
                {isFixedBasket ? (
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Not applicable for Fixed Basket
                  </p>
                ) : selectedUniverse ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Filters are linked to the selected universe
                  </p>
                ) : null}
              </>
            )}
          />
        </div>

        <div className={isFixedBasket ? "opacity-50 pointer-events-none" : ""}>
          <FormField
            control={control}
            name="selectedRanking"
            render={({ field }) => (
              <>
                <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                  Ranking
                </label>
                <CustomDropdown
                  options={rankingOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select ranking"
                  disabled={isFixedBasket}
                />
                {isFixedBasket && (
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Not applicable for Fixed Basket
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className={isFixedBasket ? "opacity-50 pointer-events-none" : ""}>
          <FormField
            control={control}
            name="selectedWeighting"
            render={({ field }) => (
              <>
                <label className="block text-sm mb-2" style={{ color: "#0B236B" }}>
                  Weighting &amp; Constraints
                </label>
                <CustomDropdown
                  options={weightingOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select weighting"
                  disabled={isFixedBasket}
                />
                {isFixedBasket && (
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Not applicable for Fixed Basket
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
