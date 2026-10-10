const fruitRows = [
["Banana","வாழைப்பழம்",42,"kg","banana"],["Apple","ஆப்பிள்",180,"kg","apple"],["Orange","ஆரஞ்சு",90,"kg","orange"],["Mosambi","சாத்துக்குடி",85,"kg","orange"],["Mango","மாம்பழம்",100,"kg","mango"],["Papaya","பப்பாளி",35,"kg","papaya"],["Guava","கொய்யாப்பழம்",65,"kg","guava"],["Pomegranate","மாதுளை",160,"kg","pomegranate"],["Grapes","திராட்சை",95,"kg","grapes"],["Watermelon","தர்பூசணி",28,"kg","watermelon"],
["Muskmelon","முலாம்பழம்",45,"kg","melon"],["Pineapple","அன்னாசிப்பழம்",55,"piece","pineapple"],["Sapota","சப்போட்டா",60,"kg","sapota"],["Jackfruit","பலாப்பழம்",80,"kg","jackfruit"],["Lemon","எலுமிச்சை",8,"piece","lemon"],["Pear","பேரிக்காய்",190,"kg","pear"],["Sweet Lime","மோசம்பி",90,"kg","orange"],["Strawberry","ஸ்ட்ராபெர்ரி",250,"box","strawberry"],["Kiwi","கிவி",45,"piece","kiwi"],["Dragon Fruit","டிராகன் பழம்",120,"piece","dragonfruit"],
["Amla","நெல்லிக்காய்",70,"kg","amla"],["Custard Apple","சீதாப்பழம்",90,"kg","custardapple"],["Plum","பிளம் பழம்",220,"kg","plum"],["Peach","பீச் பழம்",240,"kg","peach"],["Avocado","அவகாடோ",80,"piece","avocado"],["Coconut","தேங்காய்",35,"piece","coconut"],["Tender Coconut","இளநீர்",40,"piece","coconut"],["Dates","பேரீச்சம்பழம்",180,"500 g","dates"],["Fig","அத்திப்பழம்",220,"kg","fig"],["Cherry","செர்ரி",280,"box","cherry"],
["Black Grapes","கருப்பு திராட்சை",120,"kg","grapes"],["Green Grapes","பச்சை திராட்சை",110,"kg","grapes"],["Robusta Banana","ரோபஸ்டா வாழை",38,"kg","banana"],["Red Banana","செவ்வாழை",70,"kg","banana"],["Poovan Banana","பூவன் வாழை",55,"kg","banana"],["Nendran Banana","நேந்திரம் வாழை",65,"kg","banana"],["Hill Banana","மலை வாழை",75,"kg","banana"],["Country Apple","நாட்டு ஆப்பிள்",140,"kg","apple"],["Indian Pear","இந்திய பேரிக்காய்",150,"kg","pear"],["Green Apple","பச்சை ஆப்பிள்",210,"kg","apple"],
["Raw Mango","மாங்காய்",60,"kg","mango"],["Sweet Lime","இனிப்பு சாத்துக்குடி",85,"kg","orange"],["Indian Orange","நாட்டு ஆரஞ்சு",95,"kg","orange"],["Small Lemon","சிறிய எலுமிச்சை",70,"kg","lemon"],["Nungu","நுங்கு",60,"box","iceapple"],["Jamun","நாவல் பழம்",130,"kg","jamun"],["Ber","இலந்தைப்பழம்",70,"kg","ber"],["Longan","லாங்கன் பழம்",240,"kg","longan"],["Rambutan","ரம்புட்டான்",200,"kg","rambutan"],["Kumquat","கும்குவாட்",180,"kg","orange"]
]
const vegRows = [
["Tomato","தக்காளி",35,"kg","tomato"],["Onion","வெங்காயம்",40,"kg","onion"],["Potato","உருளைக்கிழங்கு",32,"kg","potato"],["Brinjal","கத்திரிக்காய்",38,"kg","eggplant"],["Drumstick","முருங்கைக்காய்",70,"kg","drumstick"],["Ladies' Finger","வெண்டைக்காய்",45,"kg","okra"],["Beans","பீன்ஸ்",60,"kg","beans"],["Carrot","கேரட்",55,"kg","carrot"],["Beetroot","பீட்ரூட்",40,"kg","beetroot"],["Cabbage","முட்டைக்கோஸ்",30,"kg","cabbage"],
["Cauliflower","காலிஃபிளவர்",45,"piece","cauliflower"],["Bottle Gourd","சுரைக்காய்",35,"piece","gourd"],["Bitter Gourd","பாகற்காய்",48,"kg","bittergourd"],["Ridge Gourd","பீர்க்கங்காய்",45,"kg","gourd"],["Snake Gourd","புடலங்காய்",38,"kg","gourd"],["Green Chilli","பச்சை மிளகாய்",50,"kg","chilli"],["Ginger","இஞ்சி",100,"kg","ginger"],["Garlic","பூண்டு",140,"kg","garlic"],["Cucumber","வெள்ளரிக்காய்",30,"kg","cucumber"],["Pumpkin","பூசணிக்காய்",28,"kg","pumpkin"],
["Radish","முள்ளங்கி",35,"kg","radish"],["Sweet Potato","சர்க்கரைவள்ளிக்கிழங்கு",45,"kg","sweetpotato"],["Yam","சேனைக்கிழங்கு",50,"kg","yam"],["Tapioca","மரவள்ளிக்கிழங்கு",30,"kg","tapioca"],["Raw Banana","வாழைக்காய்",10,"piece","banana"],["Plantain Stem","வாழைத்தண்டு",25,"piece","plantain"],["Plantain Flower","வாழைப்பூ",25,"piece","plantain"],["Curry Leaves","கறிவேப்பிலை",10,"bunch","curry"],["Coriander Leaves","கொத்தமல்லி",10,"bunch","coriander"],["Mint Leaves","புதினா",10,"bunch","mint"],
["Spinach","பசலைக்கீரை",15,"bunch","spinach"],["Amaranth Greens","அரைக்கீரை",15,"bunch","greens"],["Fenugreek Leaves","வெந்தயக்கீரை",15,"bunch","greens"],["Spring Onion","வெங்காயத்தாள்",25,"bunch","onion"],["Capsicum","குடைமிளகாய்",70,"kg","capsicum"],["Green Peas","பச்சைப் பட்டாணி",90,"kg","peas"],["Sweet Corn","சோளம்",25,"piece","corn"],["Broccoli","ப்ரோக்கோலி",130,"kg","broccoli"],["Mushroom","காளான்",45,"200 g","mushroom"],["Celery","செலரி",80,"bunch","celery"],
["Turnip","டர்னிப்",60,"kg","turnip"],["Colocasia","சேப்பங்கிழங்கு",55,"kg","taro"],["Shallots","சின்ன வெங்காயம்",65,"kg","shallot"],["Raw Papaya","பச்சைப் பப்பாளி",30,"kg","papaya"],["Ivy Gourd","கோவைக்காய்",45,"kg","ivy"],["Cluster Beans","கொத்தவரங்காய்",55,"kg","beans"],["Broad Beans","அவரைக்காய்",50,"kg","beans"],["Chow Chow","சௌசௌ",35,"kg","chayote"],["Ash Gourd","வெள்ளைப் பூசணி",28,"kg","gourd"],["Fresh Turmeric","பச்சை மஞ்சள்",90,"kg","ginger"]
]

const imageByKey = {
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85",
  orange: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=85",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=85",
  papaya: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=700&q=85",
  guava: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=700&q=85",
  pomegranate: "https://images.unsplash.com/photo-1541344999736-5a4b6b8f?auto=format&fit=crop&w=700&q=85",
  grapes: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=85",
  watermelon: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=700&q=85",
  melon: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=700&q=85",
  pineapple: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=85",
  sapota: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=700&q=85",
  jackfruit: "https://images.unsplash.com/photo-1604495772376-9657f0035eb5?auto=format&fit=crop&w=700&q=85",
  lemon: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=85",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=85",
  kiwi: "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=700&q=85",
  dragonfruit: "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=700&q=85",
  coconut: "https://images.unsplash.com/photo-1550989460-0e2e8d?auto=format&fit=crop&w=700&q=85",
  dates: "https://images.unsplash.com/photo-1590080877777-4b9f8e7b?auto=format&fit=crop&w=700&q=85",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85",
  onion: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  eggplant: "https://images.unsplash.com/photo-1659261200838-3d3b4e?auto=format&fit=crop&w=700&q=85",
  drumstick: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=700&q=85",
  okra: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=700&q=85",
  beans: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=700&q=85",
  carrot: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=85",
  beetroot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=700&q=85",
  cabbage: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=700&q=85",
  cauliflower: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=700&q=85",
  gourd: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=700&q=85",
  bittergourd: "https://images.unsplash.com/photo-1605197378541-1d7c0e4b?auto=format&fit=crop&w=700&q=85",
  chilli: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=700&q=85",
  ginger: "https://images.unsplash.com/photo-1615485500704-8e990f9900f2?auto=format&fit=crop&w=700&q=85",
  garlic: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=700&q=85",
  cucumber: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=700&q=85",
  pumpkin: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=700&q=85",
  radish: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=700&q=85",
  sweetpotato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  yam: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  tapioca: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  plantain: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85",
  curry: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=700&q=85",
  coriander: "https://images.unsplash.com/photo-1615485500704-8e990f9900f2?auto=format&fit=crop&w=700&q=85",
  mint: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=700&q=85",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85",
  greens: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85",
  capsicum: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=85",
  peas: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=700&q=85",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=85",
  broccoli: "https://images.unsplash.com/photo-1459411621453-7c039d0eac4a?auto=format&fit=crop&w=700&q=85",
  mushroom: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=700&q=85",
  celery: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  turnip: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=700&q=85",
  taro: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  shallot: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85",
  ivy: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=700&q=85",
  chayote: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=700&q=85"
};

export const allProducts = [
  ...fruitRows.map((r) => ({
    name: r[0], tamil: r[1], category: "fruit", price: r[2], unit: r[3],
    image: imageByKey[r[4]] || imageByKey.apple, stock: 30, available: 1
  })),
  ...vegRows.map((r) => ({
    name: r[0], tamil: r[1], category: "vegetable", price: r[2], unit: r[3],
    image: imageByKey[r[4]] || imageByKey.tomato, stock: 30, available: 1
  }))
];
export const villages = ["Chettikulam","Perumanel","Srirenganarayanapuram","AnuVijay Township","Pudumanai"];
