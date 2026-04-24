"use client";

import { useEffect, useMemo, useState } from "react";

type DealerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  identityType: string;
  identityValue: string;
  issuingCountry: string;
  identityStatus: string;

  dealType: string;

  creditScore: string;
  monthlyIncome: string;

  selectedVehicleId: string;
  stockNumber: string;
  vin: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePrice: string;

  downPayment: string;
  tradeIn: string;
  amountFinanced: string;

  acceptedTerms: boolean;
};

type VehicleOption = {
  id: string;
  stockNumber: string;
  vin?: string | null;
  year: number;
  make: string;
  model: string;
  mileage: number;
  vehicleClass: string;
  askingPrice: number;
  status: string;
};

const initialForm: DealerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  identityType: "DRIVERS_LICENSE",
  identityValue: "",
  issuingCountry: "United States",
  identityStatus: "VERIFIED",

  dealType: "RETAIL",

  creditScore: "",
  monthlyIncome: "",

  selectedVehicleId: "",
  stockNumber: "",
  vin: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vehiclePrice: "",

  downPayment: "",
  tradeIn: "",
  amountFinanced: "",

  acceptedTerms: false,
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatMoneyInput(value: string) {
  if (!value.trim()) return "";
  const numeric = Number(value.replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(numeric)) return "";
  return numeric.toFixed(2);
}

function displayCurrency(value: string) {
  if (!value.trim()) return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "";
  return `$${numeric.toFixed(2)}`;
}

function isValidVin(value: string) {
  const vin = value.trim().toUpperCase();
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

export default function DealerPage() {
  const [form, setForm] = useState<DealerForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const calculatedAmountFinanced = useMemo(() => {
    const vehiclePrice = toNumber(form.vehiclePrice);
    const downPayment = toNumber(form.downPayment);
    const tradeIn = toNumber(form.tradeIn);
    const result = vehiclePrice - downPayment - tradeIn;
    return result > 0 ? result : 0;
  }, [form.vehiclePrice, form.downPayment, form.tradeIn]);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoadingVehicles(true);

        const res = await fetch("/api/vehicle-options", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setMessage(data?.reason || "Failed to load inventory");
          setMessageType("error");
          setVehicles([]);
          return;
        }

        setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
      } catch (error) {
        console.error("LOAD VEHICLES ERROR:", error);
        setMessage("Failed to load inventory");
        setMessageType("error");
        setVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    }

    loadVehicles();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    if (name === "vin") {
      const cleaned = value
        .toUpperCase()
        .replace(/[^A-HJ-NPR-Z0-9]/g, "")
        .slice(0, 17);

      setForm((prev) => ({
        ...prev,
        vin: cleaned,
      }));
      return;
    }

    if (name === "selectedVehicleId") {
      const selectedVehicle = vehicles.find((vehicle) => vehicle.id === value);

      if (!selectedVehicle) {
        setForm((prev) => ({
          ...prev,
          selectedVehicleId: "",
          stockNumber: "",
          vin: "",
          vehicleYear: "",
          vehicleMake: "",
          vehicleModel: "",
          vehiclePrice: "",
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        selectedVehicleId: selectedVehicle.id,
        stockNumber: selectedVehicle.stockNumber || "",
        vin: selectedVehicle.vin
          ? selectedVehicle.vin
              .toUpperCase()
              .replace(/[^A-HJ-NPR-Z0-9]/g, "")
              .slice(0, 17)
          : "",
        vehicleYear: String(selectedVehicle.year || ""),
        vehicleMake: selectedVehicle.make || "",
        vehicleModel: selectedVehicle.model || "",
        vehiclePrice:
          typeof selectedVehicle.askingPrice === "number"
            ? selectedVehicle.askingPrice.toFixed(2)
            : "",
      }));
      return;
    }

    if (
      name === "vehiclePrice" ||
      name === "downPayment" ||
      name === "tradeIn" ||
      name === "monthlyIncome"
    ) {
      const cleaned = value.replace(/[^0-9.]/g, "");
      setForm((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBlurCurrency(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (
      name !== "vehiclePrice" &&
      name !== "downPayment" &&
      name !== "tradeIn" &&
      name !== "monthlyIncome"
    ) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: formatMoneyInput(value),
    }));
  }

  async function handleSaveDraft() {
    setMessage("");
    setMessageType("");

    if (!form.acceptedTerms) {
      setMessage("You must accept Terms of Service and Privacy Policy before saving.");
      setMessageType("error");
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setMessage("First name and last name are required.");
      setMessageType("error");
      return;
    }

    if (!form.creditScore.trim() || !form.monthlyIncome.trim()) {
      setMessage("Credit score and monthly income are required for underwriting.");
      setMessageType("error");
      return;
    }

    if (!form.selectedVehicleId.trim()) {
      setMessage("Please select a vehicle from inventory.");
      setMessageType("error");
      return;
    }

    if (!isValidVin(form.vin)) {
      setMessage("VIN must be exactly 17 valid characters and cannot contain I, O, or Q.");
      setMessageType("error");
      return;
    }

    if (!form.vehiclePrice.trim()) {
      setMessage("Vehicle price is required.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        vin: form.vin.trim().toUpperCase(),
        amountFinanced:
          form.amountFinanced.trim() !== ""
            ? formatMoneyInput(form.amountFinanced)
            : calculatedAmountFinanced.toFixed(2),
        requestedVehicle:
          [form.vehicleYear, form.vehicleMake, form.vehicleModel]
            .filter(Boolean)
            .join(" ") || null,
        requestedPrice: formatMoneyInput(form.vehiclePrice),
      };

      const res = await fetch("/api/save-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data?.reason || "Failed to save draft");
        setMessageType("error");
        return;
      }

      setMessage("Draft saved successfully");
      setMessageType("success");
      setForm(initialForm);
    } catch (error) {
      console.error("DEALER SAVE DRAFT ERROR:", error);
      setMessage("Failed to save draft");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-8 text-[#111111] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-[13px] uppercase tracking-[0.32em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em]">
            Deal Intake
          </h1>
          <p className="mt-4 max-w-4xl text-2xl leading-[1.6] text-black/65">
            Create a structured application for controller review and underwriting.
            Select live inventory and auto-populate vehicle details directly from your system.
          </p>
        </div>

        {message ? (
          <div
            className={`mb-8 rounded-[24px] border px-7 py-6 text-[18px] ${
              messageType === "success"
                ? "border-[#bfe3c6] bg-[#eaf6ee] text-[#2d7a45]"
                : "border-[#efc7c7] bg-[#fff3f3] text-[#c64223]"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="grid gap-6">
              <div className="rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
                <h2 className="text-[28px] font-semibold tracking-[-0.04em]">
                  Applicant Information
                </h2>
                <p className="mt-2 text-[15px] text-black/55">Core borrower details</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                  <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                  <Field label="Email" name="email" value={form.email} onChange={handleChange} />
                  <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
                <h2 className="text-[28px] font-semibold tracking-[-0.04em]">
                  Identity Verification
                </h2>
                <p className="mt-2 text-[15px] text-black/55">Verified identity data</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Identity Type"
                    name="identityType"
                    value={form.identityType}
                    onChange={handleChange}
                    options={[
                      { value: "DRIVERS_LICENSE", label: "Driver's License" },
                      { value: "SSN", label: "SSN" },
                      { value: "PASSPORT", label: "Passport" },
                      { value: "STATE_ID", label: "State ID" },
                    ]}
                  />

                  <Field
                    label="Identity Number"
                    name="identityValue"
                    value={form.identityValue}
                    onChange={handleChange}
                  />

                  <Field
                    label="Issuing Country"
                    name="issuingCountry"
                    value={form.issuingCountry}
                    onChange={handleChange}
                  />

                  <SelectField
                    label="Identity Status"
                    name="identityStatus"
                    value={form.identityStatus}
                    onChange={handleChange}
                    options={[
                      { value: "VERIFIED", label: "Verified" },
                      { value: "PENDING", label: "Pending" },
                      { value: "REJECTED", label: "Rejected" },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
                <h2 className="text-[28px] font-semibold tracking-[-0.04em]">
                  Deal Structure
                </h2>
                <p className="mt-2 text-[15px] text-black/55">
                  Select the financing structure for this file
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Deal Type"
                    name="dealType"
                    value={form.dealType}
                    onChange={handleChange}
                    options={[
                      { value: "RETAIL", label: "Retail" },
                      { value: "IBL", label: "IBL (Income Based Lending)" },
                      { value: "LEASE", label: "Lease" },
                      { value: "SUBSCRIPTION", label: "Subscription" },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
                <h2 className="text-[28px] font-semibold tracking-[-0.04em]">
                  Borrower Financials
                </h2>
                <p className="mt-2 text-[15px] text-black/55">
                  Income and credit for underwriting
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Credit Score"
                    name="creditScore"
                    value={form.creditScore}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                  <CurrencyField
                    label="Monthly Income"
                    name="monthlyIncome"
                    value={form.monthlyIncome}
                    onChange={handleChange}
                    onBlur={handleBlurCurrency}
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-black/6 bg-[#fcfbf8] p-6">
                <h2 className="text-[28px] font-semibold tracking-[-0.04em]">
                  Vehicle Structure
                </h2>
                <p className="mt-2 text-[15px] text-black/55">
                  Select live inventory and auto-populate the vehicle structure
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <SelectField
                    label={loadingVehicles ? "Loading Inventory..." : "Select Vehicle"}
                    name="selectedVehicleId"
                    value={form.selectedVehicleId}
                    onChange={handleChange}
                    options={[
                      { value: "", label: loadingVehicles ? "Loading..." : "Choose vehicle" },
                      ...vehicles.map((vehicle) => ({
                        value: vehicle.id,
                        label: `${vehicle.stockNumber} • ${vehicle.year} ${vehicle.make} ${vehicle.model} • $${vehicle.askingPrice.toLocaleString()}`,
                      })),
                    ]}
                  />

                  <Field
                    label="Stock Number"
                    name="stockNumber"
                    value={form.stockNumber}
                    onChange={handleChange}
                  />

                  <Field
                    label="VIN"
                    name="vin"
                    value={form.vin}
                    onChange={handleChange}
                  />

                  <Field
                    label="Vehicle Year"
                    name="vehicleYear"
                    value={form.vehicleYear}
                    onChange={handleChange}
                    inputMode="numeric"
                  />

                  <Field
                    label="Vehicle Make"
                    name="vehicleMake"
                    value={form.vehicleMake}
                    onChange={handleChange}
                  />

                  <Field
                    label="Vehicle Model"
                    name="vehicleModel"
                    value={form.vehicleModel}
                    onChange={handleChange}
                  />

                  <CurrencyField
                    label="Vehicle Price"
                    name="vehiclePrice"
                    value={form.vehiclePrice}
                    onChange={handleChange}
                    onBlur={handleBlurCurrency}
                  />

                  <CurrencyField
                    label="Down Payment"
                    name="downPayment"
                    value={form.downPayment}
                    onChange={handleChange}
                    onBlur={handleBlurCurrency}
                  />

                  <CurrencyField
                    label="Trade-In"
                    name="tradeIn"
                    value={form.tradeIn}
                    onChange={handleChange}
                    onBlur={handleBlurCurrency}
                  />

                  <CurrencyField
                    label="Amount Financed"
                    name="amountFinanced"
                    value={
                      form.amountFinanced.trim() !== ""
                        ? form.amountFinanced
                        : calculatedAmountFinanced
                        ? calculatedAmountFinanced.toFixed(2)
                        : ""
                    }
                    onChange={handleChange}
                    onBlur={handleBlurCurrency}
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <h2 className="text-[32px] font-semibold tracking-[-0.05em]">
              Submission Readiness
            </h2>
            <p className="mt-2 text-[16px] leading-[1.6] text-black/55">
              Everything the file must provide before underwriting review.
            </p>

            <div className="mt-6 space-y-4">
              <ReadinessRow label="First name entered" ready={!!form.firstName.trim()} />
              <ReadinessRow label="Last name entered" ready={!!form.lastName.trim()} />
              <ReadinessRow label="Identity verified" ready={form.identityStatus === "VERIFIED"} />
              <ReadinessRow label="Deal type selected" ready={!!form.dealType.trim()} />
              <ReadinessRow label="Credit score entered" ready={!!form.creditScore.trim()} />
              <ReadinessRow label="Monthly income entered" ready={!!form.monthlyIncome.trim()} />
              <ReadinessRow label="Inventory vehicle selected" ready={!!form.selectedVehicleId.trim()} />
              <ReadinessRow label="VIN valid" ready={isValidVin(form.vin)} />
              <ReadinessRow label="Vehicle price entered" ready={!!form.vehiclePrice.trim()} />
              <ReadinessRow label="Terms accepted" ready={form.acceptedTerms} />
            </div>

            <div className="mt-8 rounded-[24px] border border-black/8 bg-[#faf7f1] p-5">
              <div className="text-[14px] uppercase tracking-[0.22em] text-black/45">
                Calculated Structure
              </div>

              <div className="mt-4 space-y-3 text-[16px] text-black/70">
                <div className="flex items-center justify-between gap-4">
                  <span>Deal Type</span>
                  <span className="font-semibold text-black">
                    {form.dealType || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Selected Vehicle</span>
                  <span className="font-semibold text-black">
                    {[form.vehicleYear, form.vehicleMake, form.vehicleModel]
                      .filter(Boolean)
                      .join(" ") || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>VIN</span>
                  <span className="font-semibold text-black">
                    {form.vin || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Requested Price</span>
                  <span className="font-semibold text-black">
                    {displayCurrency(form.vehiclePrice) || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Amount Financed</span>
                  <span className="font-semibold text-black">
                    ${calculatedAmountFinanced.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-black/8 bg-[#faf7f1] p-5">
              <label className="flex items-start gap-3 text-[15px] leading-[1.6] text-black/65">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={form.acceptedTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="underline hover:text-black">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-black">
                    Privacy Policy
                  </a>.
                </span>
              </label>
            </div>

            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="mt-8 w-full rounded-[20px] bg-black px-6 py-4 text-[17px] font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving Draft..." : "Save Draft"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] uppercase tracking-[0.22em] text-black/45">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        className="w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 text-[18px] outline-none"
      />
    </div>
  );
}

function CurrencyField({
  label,
  name,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] uppercase tracking-[0.22em] text-black/45">
        {label}
      </label>
      <div className="flex items-center rounded-[18px] border border-black/10 bg-white px-5">
        <span className="text-[18px] text-black/55">$</span>
        <input
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputMode="decimal"
          className="w-full bg-transparent px-3 py-4 text-[18px] outline-none"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] uppercase tracking-[0.22em] text-black/45">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 text-[18px] outline-none"
      >
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReadinessRow({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-black/8 bg-white px-4 py-4">
      <span className="text-[15px] text-black/65">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] ${
          ready
            ? "bg-[#eaf6ee] text-[#2d7a45]"
            : "bg-[#f5f1ea] text-black/45"
        }`}
      >
        {ready ? "Ready" : "Missing"}
      </span>
    </div>
  );
}
