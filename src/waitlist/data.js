export const USE_MOCK = false;

// Placeholder until Haruki's privacy policy page exists
export const PRIVACY_PATH = "/privacy";

export const COUNTRY_GROUPS = [
  {
    group: "Africa",
    options: [
      "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
      "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
      "Congo (Republic)", "Congo (DRC)", "Côte d'Ivoire", "Djibouti", "Egypt",
      "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
      "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya",
      "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco",
      "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
      "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
      "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia",
      "Uganda", "Zambia", "Zimbabwe",
    ],
  },
  { group: "Diaspora", options: ["United States", "United Kingdom", "Canada"] },
];

// Suggestions only. People can always type any city.
export const CITIES = {
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City", "Kaduna", "Calabar", "Warri"],
  Ghana: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Gqeberha", "Bloemfontein"],
  Zimbabwe: ["Harare", "Bulawayo", "Mutare", "Gweru"],
  Uganda: ["Kampala", "Entebbe", "Jinja", "Gulu"],
  Tanzania: ["Dar es Salaam", "Dodoma", "Arusha", "Zanzibar City", "Mwanza"],
  Ethiopia: ["Addis Ababa", "Dire Dawa", "Bahir Dar", "Hawassa"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor"],
  Morocco: ["Casablanca", "Marrakech", "Rabat", "Tangier"],
  Senegal: ["Dakar", "Saint-Louis", "Thiès"],
  "Côte d'Ivoire": ["Abidjan", "Yamoussoukro", "Bouaké"],
  Cameroon: ["Douala", "Yaoundé", "Bamenda"],
  Rwanda: ["Kigali", "Butare"],
  Zambia: ["Lusaka", "Ndola", "Livingstone"],
  Botswana: ["Gaborone", "Francistown"],
  Namibia: ["Windhoek"],
  Mauritius: ["Port Louis"],
  "Congo (DRC)": ["Kinshasa", "Lubumbashi"],
  "United States": ["New York", "Los Angeles", "Atlanta", "Houston", "Chicago", "Washington DC", "Dallas", "Miami"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Bristol", "Glasgow", "Liverpool"],
  Canada: ["Toronto", "Montréal", "Ottawa", "Calgary", "Vancouver", "Edmonton"],
};

export const DISCIPLINE_GROUPS = [
  { group: "Image", options: ["Photography", "Videography", "Film direction", "Drone and aerial"] },
  { group: "Art", options: ["Painting", "Illustration", "Digital art", "Sculpture", "Mixed media", "Printmaking", "Murals and street art"] },
  { group: "Design and motion", options: ["Graphic design", "Animation and motion", "3D and CGI", "Set design", "Creative direction"] },
  { group: "Beauty and fashion", options: ["Makeup", "Hair", "Fashion styling", "Fashion design", "Modelling"] },
  { group: "Other", options: ["Tattoo", "Editing and retouching", "Something else"] },
];

export const BOOKING_FOR = [
  "Myself",
  "An event",
  "A small business",
  "A brand",
  "An agency",
  "Something else",
];

// Left-hand copy for each tab. The client copy is a placeholder until Haruki writes it.
export const PITCH = {
  artist: {
    tagline: "The booking platform for African and diasporan creatives.",
    lead: "Get found, get booked, get paid in full.",
    points: [
      { lead: "Be found", rest: "by clients and brands looking for creatives in your city." },
      { lead: "Agree the job", rest: "on the platform, with no agency in the middle." },
      { lead: "Get paid", rest: "directly. Payment is held safely until the work is delivered." },
    ],
    closing:
      "Joining is free. Sign up for early access and be among the first creatives that clients can book when we open.",
    formTitle: "Join the artist waitlist",
    submit: "Join the artist waitlist",
    success: "We'll email you when VibeGig opens for bookings.",
  },
  client: {
    tagline: "Find and book African and diasporan creatives.",
    lead: "Find the right creative, agree the job, pay with confidence.",
    points: [
      { lead: "Find", rest: "photographers, artists, stylists and more, in your city." },
      { lead: "Agree the job", rest: "on the platform, with no agency in the middle." },
      { lead: "Pay with confidence.", rest: "Payment is held safely until the work is delivered." },
    ],
    closing:
      "Joining is free. Join the early-access list and be among the first to book when we open.",
    formTitle: "Join the client waitlist",
    submit: "Join the client waitlist",
    success: "We'll email you when VibeGig opens so you can start booking.",
  },
};

export async function submitWaitlist(payload) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 900)); // fake network
    console.log("Waitlist signup (mock):", payload);
    return { ok: true };
  }
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Waitlist request failed (${res.status})`);
  return res.json();
   }
