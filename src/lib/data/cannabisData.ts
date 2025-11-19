// Cannabis Product Data - Effects, Terpenes, and Metadata

export interface CannabisEffect {
  id: string
  name: string
  description: string
  icon: string
  category: "positive" | "negative" | "medical"
}

export interface Terpene {
  id: string
  name: string
  description: string
  aroma: string[]
  effects: string[]
  medicalBenefits: string[]
  commonStrains: string[]
}

export const cannabisEffects: CannabisEffect[] = [
  // Positive Effects
  {
    id: "relaxed",
    name: "Relaxed",
    description: "Promotes relaxation and calmness",
    icon: "😌",
    category: "positive",
  },
  {
    id: "happy",
    name: "Happy",
    description: "Elevates mood and brings joy",
    icon: "😊",
    category: "positive",
  },
  {
    id: "euphoric",
    name: "Euphoric",
    description: "Creates feelings of bliss and contentment",
    icon: "🌟",
    category: "positive",
  },
  {
    id: "energetic",
    name: "Energetic",
    description: "Boosts energy and motivation",
    icon: "⚡",
    category: "positive",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Enhances creativity and focus",
    icon: "🎨",
    category: "positive",
  },
  {
    id: "focused",
    name: "Focused",
    description: "Improves concentration and mental clarity",
    icon: "🎯",
    category: "positive",
  },
  {
    id: "uplifted",
    name: "Uplifted",
    description: "Elevates spirits and mood",
    icon: "🚀",
    category: "positive",
  },
  {
    id: "sleepy",
    name: "Sleepy",
    description: "Promotes restful sleep",
    icon: "😴",
    category: "positive",
  },

  // Medical Effects
  {
    id: "pain-relief",
    name: "Pain Relief",
    description: "Helps manage chronic and acute pain",
    icon: "💪",
    category: "medical",
  },
  {
    id: "stress-relief",
    name: "Stress Relief",
    description: "Reduces stress and anxiety",
    icon: "🧘",
    category: "medical",
  },
  {
    id: "appetite",
    name: "Appetite Stimulation",
    description: "Increases appetite",
    icon: "🍽️",
    category: "medical",
  },
  {
    id: "nausea",
    name: "Anti-Nausea",
    description: "Reduces nausea and vomiting",
    icon: "💊",
    category: "medical",
  },
  {
    id: "inflammation",
    name: "Anti-Inflammatory",
    description: "Reduces inflammation",
    icon: "🔥",
    category: "medical",
  },

  // Negative Effects
  {
    id: "dry-mouth",
    name: "Dry Mouth",
    description: "May cause dry mouth",
    icon: "💧",
    category: "negative",
  },
  {
    id: "dry-eyes",
    name: "Dry Eyes",
    description: "May cause dry eyes",
    icon: "👁️",
    category: "negative",
  },
  {
    id: "anxiety",
    name: "Anxious",
    description: "May increase anxiety in some users",
    icon: "😰",
    category: "negative",
  },
  {
    id: "paranoid",
    name: "Paranoid",
    description: "May cause paranoia in high doses",
    icon: "😨",
    category: "negative",
  },
]

export const terpenes: Terpene[] = [
  {
    id: "myrcene",
    name: "Myrcene",
    description: "The most common terpene in cannabis, known for its earthy, musky aroma",
    aroma: ["Earthy", "Musky", "Herbal", "Clove"],
    effects: ["Relaxing", "Sedating", "Anti-inflammatory"],
    medicalBenefits: ["Pain relief", "Muscle relaxation", "Sleep aid"],
    commonStrains: ["Blue Dream", "OG Kush", "Granddaddy Purple"],
  },
  {
    id: "limonene",
    name: "Limonene",
    description: "Citrusy terpene with mood-elevating properties",
    aroma: ["Citrus", "Lemon", "Orange", "Lime"],
    effects: ["Uplifting", "Mood-enhancing", "Stress-relieving"],
    medicalBenefits: ["Anti-anxiety", "Anti-depression", "Immune support"],
    commonStrains: ["Lemon Haze", "Durban Poison", "Jack Herer"],
  },
  {
    id: "pinene",
    name: "Pinene",
    description: "Pine-scented terpene that promotes alertness",
    aroma: ["Pine", "Fresh", "Woodsy", "Herbal"],
    effects: ["Alertness", "Memory retention", "Bronchodilator"],
    medicalBenefits: ["Respiratory health", "Memory", "Anti-inflammatory"],
    commonStrains: ["Jack Herer", "Blue Dream", "OG Kush"],
  },
  {
    id: "caryophyllene",
    name: "Caryophyllene",
    description: "Spicy terpene that binds to CB2 receptors",
    aroma: ["Spicy", "Peppery", "Woody", "Clove"],
    effects: ["Anti-inflammatory", "Pain relief", "Anti-anxiety"],
    medicalBenefits: ["Chronic pain", "Inflammation", "Stress reduction"],
    commonStrains: ["Bubba Kush", "Sour Diesel", "Chemdog"],
  },
  {
    id: "linalool",
    name: "Linalool",
    description: "Floral terpene found in lavender with calming properties",
    aroma: ["Floral", "Lavender", "Sweet", "Spicy"],
    effects: ["Calming", "Relaxing", "Anti-anxiety"],
    medicalBenefits: ["Sleep aid", "Stress relief", "Anti-seizure"],
    commonStrains: ["Amnesia Haze", "Lavender", "LA Confidential"],
  },
  {
    id: "humulene",
    name: "Humulene",
    description: "Earthy, woody terpene with appetite-suppressing properties",
    aroma: ["Earthy", "Woody", "Hoppy", "Spicy"],
    effects: ["Appetite suppressant", "Anti-inflammatory"],
    medicalBenefits: ["Weight management", "Pain relief", "Antibacterial"],
    commonStrains: ["Sour Diesel", "White Widow", "Headband"],
  },
  {
    id: "terpinolene",
    name: "Terpinolene",
    description: "Complex terpene with herbal, floral, and citrus notes",
    aroma: ["Herbal", "Floral", "Citrus", "Pine"],
    effects: ["Uplifting", "Sedating (high doses)", "Antioxidant"],
    medicalBenefits: ["Antibacterial", "Antifungal", "Antioxidant"],
    commonStrains: ["Jack Herer", "Dutch Treat", "XJ-13"],
  },
  {
    id: "ocimene",
    name: "Ocimene",
    description: "Sweet, herbaceous terpene with potential medical benefits",
    aroma: ["Sweet", "Herbal", "Woody", "Citrus"],
    effects: ["Uplifting", "Energizing", "Decongestant"],
    medicalBenefits: ["Anti-inflammatory", "Antiviral", "Antifungal"],
    commonStrains: ["Green Crack", "Clementine", "Space Queen"],
  },
]

export const strainTypes = [
  {
    id: "indica",
    name: "Indica",
    description: "Known for relaxing, body-focused effects. Best for evening use.",
    effects: ["Relaxed", "Sleepy", "Pain Relief"],
    icon: "🌙",
  },
  {
    id: "sativa",
    name: "Sativa",
    description: "Known for energizing, cerebral effects. Best for daytime use.",
    effects: ["Energetic", "Creative", "Focused", "Uplifted"],
    icon: "☀️",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    description: "Balanced blend of indica and sativa effects.",
    effects: ["Balanced", "Versatile", "Mixed Effects"],
    icon: "🌈",
  },
]

export const symptoms = [
  "Pain",
  "Anxiety",
  "Depression",
  "Insomnia",
  "Nausea",
  "Inflammation",
  "Stress",
  "Lack of Appetite",
  "Fatigue",
  "Migraines",
  "PTSD",
  "Seizures",
  "Muscle Spasms",
  "Arthritis",
  "Chronic Pain",
]

// Helper function to match products by effects
export function filterByEffects(
  products: any[],
  selectedEffects: string[]
): any[] {
  if (selectedEffects.length === 0) return products

  return products.filter((product) => {
    const productEffects = product.metadata?.effects?.toLowerCase().split(", ") || []
    return selectedEffects.some((effect) =>
      productEffects.some((pEffect: string) => pEffect.includes(effect.toLowerCase()))
    )
  })
}

// Helper function to match products by terpenes
export function filterByTerpenes(
  products: any[],
  selectedTerpenes: string[]
): any[] {
  if (selectedTerpenes.length === 0) return products

  return products.filter((product) => {
    const productTerpenes = product.metadata?.terpenes?.toLowerCase().split(", ") || []
    return selectedTerpenes.some((terpene) =>
      productTerpenes.some((pTerpene: string) => pTerpene.includes(terpene.toLowerCase()))
    )
  })
}

// Helper function to filter by THC/CBD range
export function filterByCannabinoids(
  products: any[],
  thcRange?: { min: number; max: number },
  cbdRange?: { min: number; max: number }
): any[] {
  return products.filter((product) => {
    const thc = parseFloat(product.metadata?.thc_percentage || "0")
    const cbd = parseFloat(product.metadata?.cbd_percentage || "0")

    const thcMatch = thcRange
      ? thc >= thcRange.min && thc <= thcRange.max
      : true

    const cbdMatch = cbdRange
      ? cbd >= cbdRange.min && cbd <= cbdRange.max
      : true

    return thcMatch && cbdMatch
  })
}
