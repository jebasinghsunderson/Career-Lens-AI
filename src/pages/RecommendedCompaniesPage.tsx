// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { Header } from "../components/Header";
import { NavBar } from "../components/NavBar";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const SECTOR_OPTIONS = [
  "Agriculture and Allied", "Automotive", "Aviation and Defense",
  "Banking and Financial Services", "Cement and Building Materials", "Chemical Industry",
  "Consulting Services", "Diversified Conglomerates", "E-commerce / Digital Commerce",
  "Electronics and Consumer Electronics", "Engineering / Design Services",
  "Facilities Management & Business Management", "FinTech",
  "FMCG (Fast-Moving Consumer Goods)", "Gems and Jewellery", "Healthcare", "Housing",
  "Infrastructure and Construction", "IT and Software Development", "Leather and Products",
  "Logistics and Supply Chain", "Manufacturing and Industrial",
  "Media, Entertainment and Education", "Metals and Mining", "Oil, Gas and Energy",
  "Pharmaceutical", "Retail and Consumer Durables", "Shipping / Maritime", "Sports",
  "Telecom", "Textile Manufacturing", "Travel & Hospitality",
  "Workforce Solutions / HR Services",
];

const FIELDS_OPTIONS = [
  "Administration", "Business Development", "Compliance and Risk Management",
  "Construction Management", "Corporate Law", "Customer Care / Service", "Distribution",
  "Finance & Accounting", "Human Resources", "Information / Cyber Security",
  "Information Technology", "Law", "Maintenance", "Operations Management",
  "Production / Manufacturing", "Public Relations", "Purchase / Procurement",
  "Quality Control and Assurance",
  "Research and Development / Design / Product Development",
  "Sales & Marketing", "Supply Chain Management", "Training and Development",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": ["Alluri Sitharama Raju","Anakapalli","Ananthapuramu","Annamayya","Bapatla","Chittoor","East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool","Manyam","NTR","Nandyal","Nellore","Palnadu","Prakasam","Srikakulam","Sri Sathya Sai","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle","Kra Daadi","Kurung Kumey","Lepa Rada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke-Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Dibang Valley","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
  "Assam": ["Bajali","Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],
  "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
  "Chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Manendragarh","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh","Sukma","Surajpur","Surguja"],
  "Goa": ["North Goa","South Goa"],
  "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
  "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
  "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
  "Karnataka": ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Vijayanagara","Yadgir"],
  "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
  "Madhya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Maihar","Mandla","Mandsaur","Morena","Narsinghpur","Niwari","Narmadapuram","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha","Mauganj","Pandhurna"],
  "Maharashtra": ["Ahmednagar","Akola","Amravati","Chhatrapati Sambhajinagar","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Dharashiv","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
  "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
  "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
  "Mizoram": ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Saitual","Serchhip"],
  "Nagaland": ["Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyu","Tuensang","Wokha","Zunheboto"],
  "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Keonjhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"],
  "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","Mohali","Muktsar","Pathankot","Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"],
  "Rajasthan": ["Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman","Dudu","Dungarpur","Gangapur City","Hanumangarh","Jaipur","Jaipur Rural","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Jodhpur Rural","Karauli","Kekri","Khairthal-Tijara","Kotputli-Behror","Kota","Nagaur","Neem Ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sanchore","Sawai Madhopur","Shahpura","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
  "Sikkim": ["East Sikkim","North Sikkim","Pakyong","Soreng","South Sikkim","West Sikkim"],
  "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Villupuram","Virudhunagar"],
  "Telangana": ["Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Komaram Bheem Asifabad","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
  "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddh Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
  "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
  "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
  "Delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
  "Jammu and Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
  "Ladakh": ["Kargil","Leh"],
  "Puducherry": ["Karaikal","Mahe","Puducherry","Yanam"],
  "Chandigarh": ["Chandigarh"],
  "Andaman and Nicobar Islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli","Daman","Diu"],
  "Lakshadweep": ["Lakshadweep"],
};


const RECOMMENDED = [
  {
    rank: 1,
    name: "Tech Mahindra",
    domain: "techmahindra.com",
    abbr: "TM",
    sector: "IT & Software",
    location: "Hyderabad, TS",
    role: "Business Analyst Intern",
    stipend: "₹15,000 / mo",
    match: 94,
    tags: ["Top Pick", "High Stipend"],
    color: "#E31837",
    gradient: "linear-gradient(135deg,#E31837 0%,#ff6b6b 100%)",
    description:
      "Leading global technology company offering digital transformation and analytics programs with direct mentorship from senior leaders.",
  },
  {
    rank: 2,
    name: "Wipro",
    domain: "wipro.com",
    abbr: "WI",
    sector: "IT & Software",
    location: "Bengaluru, KA",
    role: "Project Management Intern",
    stipend: "₹12,000 / mo",
    match: 89,
    tags: ["Remote Option"],
    color: "#341F97",
    gradient: "linear-gradient(135deg,#341F97 0%,#7c6fcd 100%)",
    description:
      "Global IT services company with structured PM rotational programs and real project ownership from day one.",
  },
  {
    rank: 3,
    name: "Bajaj Allianz",
    domain: "bajajallianz.com",
    abbr: "BA",
    sector: "Financial Services",
    location: "Pune, MH",
    role: "Finance Intern",
    stipend: "₹10,000 / mo",
    match: 85,
    tags: ["Finance", "Certificate"],
    color: "#003399",
    gradient: "linear-gradient(135deg,#003399 0%,#0066cc 100%)",
    description:
      "India's largest private general insurance company with a structured finance internship and certification on completion.",
  },
  {
    rank: 4,
    name: "HDFC Bank",
    domain: "hdfcbank.com",
    abbr: "HDFC",
    sector: "Banking",
    location: "Mumbai, MH",
    role: "Business Operations Intern",
    stipend: "₹10,000 / mo",
    match: 81,
    tags: ["BFSI"],
    color: "#00408B",
    gradient: "linear-gradient(135deg,#00408B 0%,#0077b6 100%)",
    description:
      "India's largest private sector bank offering exposure to financial operations, analytics, and service delivery.",
  },
  {
    rank: 5,
    name: "L&T",
    domain: "larsentoubro.com",
    abbr: "L&T",
    sector: "Infrastructure",
    location: "Chennai, TN",
    role: "Business Development Intern",
    stipend: "₹8,000 / mo",
    match: 76,
    tags: ["Core Sector"],
    color: "#1A3C6E",
    gradient: "linear-gradient(135deg,#1A3C6E 0%,#2d6a9f 100%)",
    description:
      "India's largest engineering conglomerate with internships in large-scale infrastructure business development.",
  },
];

function matchBadgeStyle(pct) {
  if (pct >= 90) return { bg: "#DCFCE7", text: "#15803D", border: "#86EFAC" };
  if (pct >= 80) return { bg: "#DBEAFE", text: "#1D4ED8", border: "#93C5FD" };
  return { bg: "#FEF9C3", text: "#A16207", border: "#FDE047" };
}

// ─────────────────────────────────────────────
// Company Logo
// ─────────────────────────────────────────────
function CompanyLogo({ domain, name, abbr, color }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{
      width: 52, height: 52, borderRadius: 14,
      background: failed ? color : "#fff",
      border: "1.5px solid rgba(255,255,255,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0,
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    }}>
      {!failed ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt={name} width={34} height={34}
          style={{ objectFit: "contain" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, letterSpacing: "-0.02em" }}>
          {abbr}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Flash Card
// ─────────────────────────────────────────────
function FlashCard({ company, index }) {
  const [hovered, setHovered] = useState(false);
  const mc = matchBadgeStyle(company.match);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 280,
        flexShrink: 0,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.2)"
          : "0 4px 16px rgba(0,0,0,0.1)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        animation: `cardIn 0.5s ease ${index * 0.1}s both`,
        cursor: "pointer",
        background: "#fff",
        border: "1px solid #E2E8F0",
      }}
    >
      {/* Coloured top strip */}
      <div style={{
        background: company.gradient,
        padding: "20px 20px 16px",
        position: "relative",
      }}>
        {/* Rank badge */}
        <div style={{
          position: "absolute", top: 12, right: 14,
          background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: 999, padding: "3px 10px",
          fontSize: 11, fontWeight: 700, color: "#fff",
          letterSpacing: "0.05em",
        }}>
          #{company.rank}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <CompanyLogo domain={company.domain} name={company.name} abbr={company.abbr} color={company.color} />
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              {company.name}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              {company.sector}
            </p>
          </div>
        </div>

        {/* Match meter */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.25)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${company.match}%`,
              background: "#fff", borderRadius: 999,
              transition: "width 1s ease",
            }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
            {company.match}% match
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 20px 20px" }}>
        {/* Description */}
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#64748B", lineHeight: 1.6 }}>
          {company.description}
        </p>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {[
            ["💼", company.role],
            ["📍", company.location],
            ["💰", company.stipend],
          ].map(([icon, val]) => (
            <div key={val} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13 }}>{icon}</span>
              <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {company.tags.map(t => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600, color: company.color,
              background: `${company.color}18`,
              border: `1px solid ${company.color}40`,
              borderRadius: 999, padding: "3px 9px",
            }}>{t}</span>
          ))}
        </div>

        {/* CTA */}
        <button style={{
          width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
          background: company.gradient,
          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 3px 12px ${company.color}55`,
          transition: "opacity 0.15s ease",
          opacity: hovered ? 1 : 0.9,
        }}>
          Apply Now →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function RecommendedCompaniesPage() {
  const navigate = useNavigate();

  // Filter state
  const [filterState, setFilterState] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterFields, setFilterFields] = useState("");

  const availableDistricts = filterState ? (DISTRICTS_BY_STATE[filterState] || []) : [];

  const resetFilters = () => {
    setFilterState(""); setFilterDistrict("");
    setFilterSector(""); setFilterFields("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
    }}>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rec-cards-track::-webkit-scrollbar { height: 5px; }
        .rec-cards-track::-webkit-scrollbar-track { background: #F1F5F9; border-radius: 999px; }
        .rec-cards-track::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 999px; }
      `}</style>

      {/* ── Exact same header as LandingPage ── */}
      <TopBar />
      <Header />
      <NavBar />

      {/* ── Page content ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Hero section */}
        <div style={{ marginBottom: 40, animation: "fadeIn 0.5s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate('/onboarding/resume')}
              style={{
                padding: "7px 14px", borderRadius: 8,
                border: "1.5px solid #E2E8F0", background: "#fff",
                color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Back
            </button>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "#DCFCE7", border: "1.5px solid #86EFAC",
              borderRadius: 999, padding: "5px 14px",
            }}>
              <span style={{ width: 7, height: 7, background: "#22C55E", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#15803D", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                AI Analysis Complete
              </span>
            </div>
          </div>

          <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Your Top 5 Recommended Companies
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "#64748B", maxWidth: 580, lineHeight: 1.65 }}>
            Based on your resume and internship preferences, our AI matched you with these companies. Swipe through your personalised matches below.
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
          marginBottom: 40, animation: "fadeIn 0.5s ease 0.1s both",
        }}>
          {[
            ["🎯", "Avg. Match Score", "85%"],
            ["🏢", "Companies Analysed", "200+"],
            ["⚡", "Roles Available", "1,200+"],
            ["🚀", "Applications Open", "Active"],
          ].map(([icon, label, val]) => (
            <div key={label} style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14,
              padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{val}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Matched Internship Opportunities
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#94A3B8" }}>Scroll left → right to browse all matches</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#1E3A5F,#0F172A)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              boxShadow: "0 4px 16px rgba(15,23,42,0.2)",
            }}
          >
            View Dashboard →
          </button>
        </div>

        {/* ── 4-column grid — 5th wraps under 1st ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 280px)",
            gap: 20,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {RECOMMENDED.map((co, i) => (
            <FlashCard key={co.name} company={co} index={i} />
          ))}
        </div>

        {/* ═══════════════════════════════════════════
             FEATURED INTERNSHIPS FILTER SECTION
        ═══════════════════════════════════════════ */}
        <div style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16,
          padding: "22px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          marginTop: 40,
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Featured Internships
            </h2>
          </div>

          {/* Info badges */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { icon: "🔄", label: "Internships are posted regularly",       bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C" },
              { icon: "📅", label: "Check application deadlines carefully", bg: "#F0FDF4", border: "#86EFAC", text: "#15803D" },
              { icon: "👁️", label: "Visit often to explore & apply",        bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
            ].map(b => (
              <span key={b.label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: b.bg, border: `1px solid ${b.border}`,
                borderRadius: 999, padding: "5px 12px",
                fontSize: 12, fontWeight: 600, color: b.text,
              }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* Filter bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center" }}>

            {/* Select States */}
            <div style={{ position: "relative" }}>
              <select
                value={filterState}
                onChange={e => { setFilterState(e.target.value); setFilterDistrict(""); }}
                style={{
                  width: "100%", height: 44, padding: "0 36px 0 14px",
                  fontSize: 14, fontFamily: "inherit",
                  color: filterState ? "#1E293B" : "#94A3B8",
                  background: "#F8FAFC", border: `1.5px solid ${filterState ? "#3B82F6" : "#E2E8F0"}`,
                  borderRadius: 9, outline: "none", appearance: "none", cursor: "pointer",
                  boxShadow: filterState ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <option value="">Select States</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg width="12" height="8" viewBox="0 0 14 9" fill="none" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                <path d="M1 1L7 7L13 1" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Select Districts */}
            <div style={{ position: "relative" }}>
              <select
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                disabled={!filterState}
                style={{
                  width: "100%", height: 44, padding: "0 36px 0 14px",
                  fontSize: 14, fontFamily: "inherit",
                  color: filterDistrict ? "#1E293B" : "#94A3B8",
                  background: filterState ? "#F8FAFC" : "#F1F5F9",
                  border: `1.5px solid ${filterDistrict ? "#3B82F6" : "#E2E8F0"}`,
                  borderRadius: 9, outline: "none", appearance: "none",
                  cursor: filterState ? "pointer" : "not-allowed",
                  opacity: filterState ? 1 : 0.6,
                  boxShadow: filterDistrict ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <option value="">Select Districts</option>
                {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <svg width="12" height="8" viewBox="0 0 14 9" fill="none" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                <path d="M1 1L7 7L13 1" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Select Sector */}
            <div style={{ position: "relative" }}>
              <select
                value={filterSector}
                onChange={e => setFilterSector(e.target.value)}
                style={{
                  width: "100%", height: 44, padding: "0 36px 0 14px",
                  fontSize: 14, fontFamily: "inherit",
                  color: filterSector ? "#1E293B" : "#94A3B8",
                  background: "#F8FAFC", border: `1.5px solid ${filterSector ? "#3B82F6" : "#E2E8F0"}`,
                  borderRadius: 9, outline: "none", appearance: "none", cursor: "pointer",
                  boxShadow: filterSector ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <option value="">Select Sector</option>
                {SECTOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg width="12" height="8" viewBox="0 0 14 9" fill="none" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                <path d="M1 1L7 7L13 1" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Select Fields */}
            <div style={{ position: "relative" }}>
              <select
                value={filterFields}
                onChange={e => setFilterFields(e.target.value)}
                style={{
                  width: "100%", height: 44, padding: "0 36px 0 14px",
                  fontSize: 14, fontFamily: "inherit",
                  color: filterFields ? "#1E293B" : "#94A3B8",
                  background: "#F8FAFC", border: `1.5px solid ${filterFields ? "#3B82F6" : "#E2E8F0"}`,
                  borderRadius: 9, outline: "none", appearance: "none", cursor: "pointer",
                  boxShadow: filterFields ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <option value="">Select Fields</option>
                {FIELDS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <svg width="12" height="8" viewBox="0 0 14 9" fill="none" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                <path d="M1 1L7 7L13 1" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Remove Filters */}
            <button
              onClick={resetFilters}
              style={{
                height: 44, padding: "0 18px", borderRadius: 9, whiteSpace: "nowrap",
                border: "1.5px solid #FECACA", background: "#FFF5F5",
                color: "#DC2626", fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="#FEE2E2"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#FFF5F5"; }}
            >
              Remove Filters
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
