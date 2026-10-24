'use client';

const defaultOptions = [
  {
    id: 'none',
    name: 'None',
    description: 'No additional insurance. Driver assumes full liability.',
    price_per_day: 0,
  },
  {
    id: 'basic',
    name: 'Basic CDW',
    description: 'Collision Damage Waiver — reduces your liability in case of an accident.',
    price_per_day: 15,
  },
  {
    id: 'full',
    name: 'Full Cover',
    description: 'Full protection including CDW, theft protection, and third-party liability.',
    price_per_day: 25,
  },
];

export default function InsuranceSelector({ options, selected, onSelect }) {
  const insuranceOptions = options && options.length > 0 ? options : defaultOptions;

  return (
    <div className="space-y-3">
      {insuranceOptions.map((opt) => {
        const isSelected =
          selected === opt.id ||
          selected === opt.name ||
          (selected === null && opt.price_per_day === 0 && opt.id === 'none');

        return (
          <label
            key={opt.id || opt.name}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? 'border-[#F59E0B] bg-amber-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="insurance"
              value={opt.id || opt.name}
              checked={isSelected}
              onChange={() => onSelect(opt)}
              className="mt-1 accent-[#F59E0B]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1B3A5C]">{opt.name}</span>
                {isSelected && (
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{opt.description}</p>
            </div>
            <div className="text-right shrink-0">
              {opt.price_per_day === 0 ? (
                <span className="text-gray-400 text-sm font-medium">Free</span>
              ) : (
                <span className="text-[#1B3A5C] font-bold">
                  +${opt.price_per_day}
                  <span className="text-gray-400 font-normal text-xs">/day</span>
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
