// Shop catalog. Prices are example prices for this demo site.

const SPECIES = {
  meg: {
    name: "Megalodon", sci: "Otodus megalodon", era: "23 – 3.6 million years ago", max: "Up to 7 in", typical: 5.5, oakIsland: true,
    id: "Huge triangle with fine, even serrations and a dark chevron-shaped band (the “bourlette”) between the blade and the root.",
  },
  gw: {
    name: "Great White", sci: "Carcharodon carcharias", era: "5 million years ago – today", max: "Up to 3 in", typical: 2.4, oakIsland: true,
    id: "Broad, flat triangle with coarse, uneven serrations. No bourlette band, which is the quickest way to tell it from a small megalodon.",
  },
  otodus: {
    name: "Otodus", sci: "Otodus obliquus", era: "60 – 45 million years ago", max: "Up to 4 in", typical: 2.6, oakIsland: false,
    id: "The megalodon’s ancient ancestor. Smooth edges with no serrations, a thick root, and a small pointed cusplet on each side.",
  },
  angust: {
    name: "Angustidens", sci: "Carcharocles angustidens", era: "33 – 22 million years ago", max: "Up to 4.5 in", typical: 3.4, oakIsland: false,
    id: "Looks like a narrow megalodon with serrated side cusplets. A favorite of South Carolina river divers.",
  },
  mako: {
    name: "Mako", sci: "Isurus hastalis", era: "15 – 3 million years ago", max: "Up to 3 in", typical: 2, oakIsland: true,
    id: "Smooth, flat, knife-like blade with no serrations and a deep U-shaped root.",
  },
  tiger: {
    name: "Tiger Shark", sci: "Galeocerdo cuvier", era: "Miocene – today", max: "Up to 1.3 in", typical: 1,
    oakIsland: true,
    id: "Bent sideways like a rooster’s comb, with heavy serrations and a notch on one side. Unmistakable once you’ve seen one.",
  },
  bull: {
    name: "Bull Shark", sci: "Carcharhinus leucas", era: "Miocene – today", max: "Up to 1 in", typical: 0.85, oakIsland: true,
    id: "Upper teeth are wide triangles with fine serrations. Lower teeth are narrow spikes. Very common on NC beaches.",
  },
  sandtiger: {
    name: "Sand Tiger", sci: "Carcharias taurus", era: "Eocene – today", max: "Up to 1.5 in", typical: 1.2, oakIsland: true,
    id: "Long, thin needle with smooth edges, tiny side cusplets, and a deep U-shaped root. The most common tooth on Oak Island.",
  },
  hemi: {
    name: "Snaggletooth", sci: "Hemipristis serra", era: "Eocene – Pliocene", max: "Up to 2 in", typical: 1.5, oakIsland: true,
    id: "Strongly curved blade with big, coarse serrations that stop short of the tip. A prized find.",
  },
  lemon: {
    name: "Lemon Shark", sci: "Negaprion brevirostris", era: "Miocene – today", max: "Up to 1 in", typical: 0.8, oakIsland: true,
    id: "Narrow, smooth spike sitting on a wide, flat root. Small, black, and everywhere on North Carolina beaches.",
  },
};

const GRADES = {
  Beach: "Natural wear from the surf. Great for first-time collectors and the budget-minded.",
  Collector: "Strong color, sharp edges, and a mostly complete root. The sweet spot for most collections.",
  Museum: "Top 1% quality. Near-perfect serrations, tip, and root. Display-ready.",
};

const PRODUCTS = [
  // Megalodon
  { id: "meg-oak-island", name: "Oak Island Beach Meg", species: "meg", size: 2.1, grade: "Beach", color: "black", origin: "Oak Island, NC", price: 35,
    desc: "A true local find. Smoothed by the surf, still showing its bourlette and a hint of serrations. The classic first megalodon." },
  { id: "meg-cape-fear", name: "Cape Fear River Meg", species: "meg", size: 3.4, grade: "Collector", color: "black", origin: "Cape Fear River, NC", price: 145,
    desc: "Glossy jet-black enamel from the Cape Fear River, with a solid root and visible serrations along both edges." },
  { id: "meg-serrated-4", name: "Razor-Serrated Megalodon", species: "meg", size: 4.2, grade: "Collector", color: "gray", origin: "Cooper River, SC", price: 325, pick: true,
    desc: "Crisp serrations from root to tip and a wide bourlette. One of Braden’s favorite teeth in the shop right now." },
  { id: "meg-blue-gray", name: "Blue-Gray Megalodon", species: "meg", size: 4.6, grade: "Collector", color: "bluegray", origin: "Aurora, NC", price: 480,
    desc: "The famous blue-gray coloring of the Aurora fossil beds. Thick, heavy, and beautifully symmetrical." },
  { id: "meg-museum", name: "Museum-Grade Megalodon", species: "meg", size: 5.6, grade: "Museum", color: "tan", origin: "Ica Desert, Peru", price: 1200, pick: true, featured: true,
    desc: "The crown jewel of the shop. Desert-preserved enamel, a needle-sharp tip, and perfect serrations. A true centerpiece." },
  { id: "meg-fragment", name: "Megalodon Fragment", species: "meg", size: 2.8, grade: "Beach", color: "brown", origin: "Topsail Beach, NC", price: 18,
    desc: "A partial tooth with a big chunk of enamel and bourlette. An affordable way to hold a piece of a giant." },

  // Great white
  { id: "gw-aurora", name: "Fossil Great White", species: "gw", size: 1.5, grade: "Collector", color: "gray", origin: "Aurora, NC", price: 45,
    desc: "A neat little fossil great white with clean, coarse serrations and a complete root." },
  { id: "gw-black", name: "Black Great White (Lower)", species: "gw", size: 1.9, grade: "Collector", color: "black", origin: "Lee Creek, NC", price: 95,
    desc: "A dark, glossy lower-jaw tooth. Great whites this black are hard to find on the East Coast." },
  { id: "gw-peru", name: "Serrated Great White", species: "gw", size: 2.3, grade: "Museum", color: "tan", origin: "Pisco Formation, Peru", price: 350, pick: true, featured: true,
    desc: "Big, broad, and perfectly serrated. Pisco great whites are known for their honey-colored enamel." },

  // Otodus & angustidens
  { id: "otodus-2", name: "Otodus Obliquus", species: "otodus", size: 2.1, grade: "Collector", color: "gray", origin: "Khouribga, Morocco", price: 40,
    desc: "The 55-million-year-old ancestor of the megalodon, complete with both side cusplets." },
  { id: "otodus-3", name: "Large Otodus", species: "otodus", size: 2.9, grade: "Collector", color: "gray", origin: "Khouribga, Morocco", price: 120,
    desc: "A chunky, full-rooted Otodus with excellent cusplets. A great display piece next to a megalodon." },
  { id: "angust-3", name: "Angustidens", species: "angust", size: 3.1, grade: "Collector", color: "black", origin: "Summerville, SC", price: 275, pick: true, featured: true,
    desc: "Serrated blade, serrated cusplets, and a dark river color. A must-have for anyone who loves the megalodon family tree." },
  { id: "angust-museum", name: "Museum Angustidens", species: "angust", size: 3.6, grade: "Museum", color: "brown", origin: "Summerville, SC", price: 450, soldOut: true,
    desc: "A near-perfect angustidens with both cusplets intact. Sold, but Braden is always hunting for the next one." },

  // Mako
  { id: "mako-hastalis", name: "Hastalis Mako", species: "mako", size: 1.75, grade: "Collector", color: "bluegray", origin: "Aurora, NC", price: 35,
    desc: "Smooth and flat with a slate-blue blade. A clean, elegant tooth." },
  { id: "mako-broad", name: "Broad-Tooth Mako", species: "mako", size: 2.3, grade: "Collector", color: "brown", origin: "Sharktooth Hill, CA", price: 60,
    desc: "A wide, chocolate-brown mako from California’s famous Sharktooth Hill bone bed." },

  // Tiger, bull, sand tiger, snaggletooth, lemon
  { id: "tiger-small", name: "Tiger Shark Tooth", species: "tiger", size: 0.6, grade: "Beach", color: "black", origin: "Oak Island, NC", price: 6,
    desc: "A tiny curved tiger tooth found on Oak Island. Easy to spot once you know the shape." },
  { id: "tiger-large", name: "Large Tiger Shark Tooth", species: "tiger", size: 1.1, grade: "Collector", color: "gray", origin: "Aurora, NC", price: 25, pick: true,
    desc: "A big, heavily serrated tiger tooth. Tigers over an inch are hard to come by." },
  { id: "bull-beach", name: "Bull Shark Tooth", species: "bull", size: 0.7, grade: "Beach", color: "black", origin: "Oak Island, NC", price: 5,
    desc: "A classic Oak Island bull shark tooth. A beach-walk favorite." },
  { id: "bull-upper", name: "Serrated Bull Shark Upper", species: "bull", size: 0.9, grade: "Collector", color: "brown", origin: "Venice, FL", price: 15,
    desc: "A wide, finely serrated upper tooth in warm Florida brown." },
  { id: "sandtiger-beach", name: "Sand Tiger Tooth", species: "sandtiger", size: 0.8, grade: "Beach", color: "black", origin: "Oak Island, NC", price: 2,
    desc: "The most common tooth on Oak Island, and the one that gets most hunters hooked." },
  { id: "sandtiger-cusp", name: "Sand Tiger with Cusplets", species: "sandtiger", size: 1.2, grade: "Collector", color: "gray", origin: "Cape Fear River, NC", price: 6,
    desc: "A long, complete sand tiger with both tiny side cusplets intact, which is rare for a beach tooth." },
  { id: "hemi-small", name: "Snaggletooth", species: "hemi", size: 1.1, grade: "Collector", color: "black", origin: "Aurora, NC", price: 12,
    desc: "A curved, coarsely serrated Hemipristis tooth. Instantly recognizable." },
  { id: "hemi-big", name: "Big Snaggletooth Upper", species: "hemi", size: 1.6, grade: "Collector", color: "bluegray", origin: "Aurora, NC", price: 40, pick: true,
    desc: "A large blue-gray upper with dramatic curve and serrations. One of the prettiest teeth in the shop." },
  { id: "lemon-beach", name: "Lemon Shark Tooth", species: "lemon", size: 0.6, grade: "Beach", color: "black", origin: "Oak Island, NC", price: 3,
    desc: "A little black lemon shark tooth straight from the shell line." },
  { id: "lemon-tan", name: "Florida Lemon Shark Tooth", species: "lemon", size: 0.8, grade: "Collector", color: "tan", origin: "Venice, FL", price: 8,
    desc: "A light-colored lemon tooth with a perfect wide root." },

  // Grab bags & gifts
  { id: "bag-25", name: "Oak Island Beach Bag", kind: "bag", species: null, sizeLabel: "25 teeth", grade: "Beach", origin: "Oak Island, NC", price: 12,
    desc: "25 real fossil teeth from Oak Island (sand tiger, bull, lemon and tiger) in a little burlap bag. Perfect for kids and first-time hunters." },
  { id: "bag-hunter", name: "Hunter’s Grab Bag", kind: "bag", species: null, sizeLabel: "60 teeth + 1 meg", grade: "Beach", origin: "NC & SC", price: 25, pick: true,
    desc: "60 assorted teeth plus one guaranteed megalodon fragment. Comes with Braden’s ID card so you can sort them yourself." },
  { id: "necklace", name: "Fossil Tooth Necklace", kind: "necklace", species: "gw", color: "black", sizeLabel: "18 in cord", grade: "Collector", origin: "Oak Island, NC", price: 18,
    desc: "A real fossil tooth on an adjustable waxed cord. The best-selling gift in the shop." },
  { id: "display-box", name: "Glass-Top Display Box", kind: "box", species: "meg", color: "gray", sizeLabel: "Fits up to 5 in", grade: "Gift", origin: "Shop made", price: 22,
    desc: "A wooden riker-style box with a blue velvet bed and glass lid. Tooth not included." },
  { id: "meg-replica", name: "Megalodon Replica", kind: "replica", species: "meg", color: "cream", size: 6.5, grade: "Gift", origin: "Cast replica", price: 35,
    desc: "A life-size cast of a giant 6.5-inch megalodon tooth. Great for classrooms and size comparisons." },
];

const REVIEWS = [
  { stars: 5, text: "My son picked out his first megalodon and Braden spent ten minutes telling him how to find his own. We went straight to the beach after.", by: "Jess M., Raleigh" },
  { stars: 5, text: "Honest grading and fair prices. The ‘Collector’ meg I ordered looked even better in person.", by: "Marcus T., Charlotte" },
  { stars: 5, text: "Best shark tooth shop on the Carolina coast. The ID guide on the wall alone is worth the stop.", by: "Dana R., Myrtle Beach" },
];
