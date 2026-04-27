const mongoose = require('mongoose');
const Product = require('./models/Product');
const Farmer = require('./models/Farmer');
require('dotenv').config();

const dairyProducts = [
  // ── Fresh Milk ──
  { name: 'Cow Milk (Full Cream)',  subcategory: 'fresh-milk',    price: 60,  unit: 'litre',  stock: 100, desc: 'Fresh full cream cow milk, rich in nutrients and calcium.',         img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format' },
  { name: 'Cow Milk (Toned)',       subcategory: 'fresh-milk',    price: 50,  unit: 'litre',  stock: 100, desc: 'Toned cow milk with reduced fat, ideal for daily use.',             img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format' },
  { name: 'Buffalo Milk',           subcategory: 'fresh-milk',    price: 70,  unit: 'litre',  stock: 80,  desc: 'Pure buffalo milk, high in fat and protein.',                       img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format' },
  { name: 'Organic Milk',           subcategory: 'fresh-milk',    price: 80,  unit: 'litre',  stock: 50,  desc: 'Certified organic milk from grass-fed cows.',                       img: 'https://images.unsplash.com/photo-1600788907416-456578634209?w=500&auto=format' },
  { name: 'A2 Desi Milk',           subcategory: 'fresh-milk',    price: 90,  unit: 'litre',  stock: 40,  desc: 'Pure A2 protein milk from desi cows, easy to digest.',              img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&auto=format' },
  { name: 'Lactose Free Milk',      subcategory: 'fresh-milk',    price: 85,  unit: 'litre',  stock: 30,  desc: 'Lactose-free milk, perfect for sensitive stomachs.',                img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format' },
  { name: 'Skimmed Milk',           subcategory: 'fresh-milk',    price: 55,  unit: 'litre',  stock: 70,  desc: 'Fat-free skimmed milk, great for weight management.',               img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format' },
  { name: 'Raw Farm Fresh Milk',    subcategory: 'fresh-milk',    price: 65,  unit: 'litre',  stock: 50,  desc: 'Unpasteurized farm-fresh milk, straight from the farm.',            img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format' },
  { name: 'Goat Milk',              subcategory: 'fresh-milk',    price: 100, unit: 'litre',  stock: 25,  desc: 'Pure goat milk, naturally homogenized and easy to digest.',         img: 'https://images.unsplash.com/photo-1600788907416-456578634209?w=500&auto=format' },
  { name: 'Camel Milk',             subcategory: 'fresh-milk',    price: 150, unit: 'litre',  stock: 15,  desc: 'Rare camel milk, rich in vitamins and minerals.',                   img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&auto=format' },

  // ── Flavored Milk ──
  { name: 'Chocolate Milk',         subcategory: 'flavored-milk', price: 70,  unit: 'litre',  stock: 60,  desc: 'Delicious chocolate flavored milk, kids favourite.',                img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format' },
  { name: 'Strawberry Milk',        subcategory: 'flavored-milk', price: 70,  unit: 'litre',  stock: 60,  desc: 'Sweet strawberry flavored milk, refreshing and tasty.',             img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format' },
  { name: 'Mango Milk',             subcategory: 'flavored-milk', price: 75,  unit: 'litre',  stock: 45,  desc: 'Tropical mango flavored milk, summer special.',                     img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format' },
  { name: 'Badam Milk',             subcategory: 'flavored-milk', price: 80,  unit: 'litre',  stock: 30,  desc: 'Almond-infused milk, rich in nutrients and flavour.',               img: 'https://images.unsplash.com/photo-1600788907416-456578634209?w=500&auto=format' },
  { name: 'Turmeric Milk (Haldi)',  subcategory: 'flavored-milk', price: 65,  unit: 'litre',  stock: 35,  desc: 'Golden turmeric milk, immunity booster.',                           img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format' },
  { name: 'Rose Milk',              subcategory: 'flavored-milk', price: 65,  unit: 'litre',  stock: 40,  desc: 'Fragrant rose flavored milk, a classic Indian drink.',              img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format' },

  // ── Butter & Cream ──
  { name: 'White Butter (Makhan)',  subcategory: 'butter-cream',  price: 400, unit: 'kg',     stock: 30,  desc: 'Fresh homemade white butter, churned daily.',                       img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format' },
  { name: 'Salted Butter',          subcategory: 'butter-cream',  price: 450, unit: 'kg',     stock: 40,  desc: 'Premium salted butter, perfect for cooking and spreading.',         img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format' },
  { name: 'Unsalted Butter',        subcategory: 'butter-cream',  price: 450, unit: 'kg',     stock: 40,  desc: 'Pure unsalted butter, ideal for baking.',                           img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format' },
  { name: 'Fresh Cream',            subcategory: 'butter-cream',  price: 300, unit: 'kg',     stock: 25,  desc: 'Fresh dairy cream, perfect for desserts and cooking.',              img: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=500&auto=format' },
  { name: 'Whipping Cream',         subcategory: 'butter-cream',  price: 350, unit: 'kg',     stock: 20,  desc: 'Premium whipping cream for cakes and desserts.',                    img: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format' },
  { name: 'Malai (Milk Cream)',     subcategory: 'butter-cream',  price: 280, unit: 'kg',     stock: 30,  desc: 'Fresh milk cream (malai), collected daily from boiled milk.',       img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format' },
  { name: 'Clotted Cream',          subcategory: 'butter-cream',  price: 380, unit: 'kg',     stock: 18,  desc: 'Thick clotted cream, rich and indulgent.',                          img: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=500&auto=format' },

  // ── Paneer & Cheese ──
  { name: 'Fresh Paneer',           subcategory: 'paneer-cheese', price: 350, unit: 'kg',     stock: 50,  desc: 'Soft fresh cottage cheese (paneer), made daily.',                  img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format' },
  { name: 'Malai Paneer',           subcategory: 'paneer-cheese', price: 400, unit: 'kg',     stock: 40,  desc: 'Extra soft malai paneer, melt-in-mouth texture.',                  img: 'https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=500&auto=format' },
  { name: 'Smoked Paneer',          subcategory: 'paneer-cheese', price: 420, unit: 'kg',     stock: 20,  desc: 'Lightly smoked paneer with a unique flavour.',                      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format' },
  { name: 'Mozzarella Cheese',      subcategory: 'paneer-cheese', price: 500, unit: 'kg',     stock: 25,  desc: 'Premium mozzarella cheese, perfect for pizza.',                    img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format' },
  { name: 'Cheddar Cheese',         subcategory: 'paneer-cheese', price: 480, unit: 'kg',     stock: 30,  desc: 'Aged cheddar cheese with sharp flavour.',                           img: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=500&auto=format' },
  { name: 'Cheese Slices',          subcategory: 'paneer-cheese', price: 200, unit: 'piece',  stock: 100, desc: 'Processed cheese slices, great for sandwiches and burgers.',       img: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format' },
  { name: 'Ricotta Cheese',         subcategory: 'paneer-cheese', price: 460, unit: 'kg',     stock: 15,  desc: 'Creamy ricotta cheese, perfect for pasta and desserts.',            img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format' },

  // ── Ghee ──
  { name: 'Cow Ghee',               subcategory: 'ghee',          price: 600, unit: 'kg',     stock: 40,  desc: 'Pure cow ghee, slow-cooked for rich aroma and flavour.',           img: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=500&auto=format' },
  { name: 'Buffalo Ghee',           subcategory: 'ghee',          price: 650, unit: 'kg',     stock: 35,  desc: 'Pure buffalo ghee, thick and aromatic.',                            img: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format' },
  { name: 'A2 Ghee (Desi Cow)',     subcategory: 'ghee',          price: 800, unit: 'kg',     stock: 25,  desc: 'Premium A2 cow ghee, made from desi cow milk.',                    img: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=500&auto=format' },
  { name: 'Bilona Ghee',            subcategory: 'ghee',          price: 900, unit: 'kg',     stock: 20,  desc: 'Traditional bilona method ghee, hand-churned from curd.',          img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format' },
  { name: 'Desi Ghee',              subcategory: 'ghee',          price: 700, unit: 'kg',     stock: 30,  desc: 'Pure desi ghee, golden and fragrant.',                              img: 'https://images.unsplash.com/photo-1596040033229-a0b3b7e8c5f8?w=500&auto=format' },
  { name: 'Organic Ghee',           subcategory: 'ghee',          price: 850, unit: 'kg',     stock: 22,  desc: 'Certified organic ghee from grass-fed cows.',                       img: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=500&auto=format' },

  // ── Curd & Dahi ──
  { name: 'Fresh Dahi (Curd)',      subcategory: 'curd-dahi',     price: 60,  unit: 'kg',     stock: 80,  desc: 'Thick fresh curd, set daily from pure milk.',                      img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format' },
  { name: 'Mishti Doi',             subcategory: 'curd-dahi',     price: 80,  unit: 'kg',     stock: 40,  desc: 'Bengali sweet curd, caramelized and creamy.',                       img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format' },
  { name: 'Greek Yogurt',           subcategory: 'curd-dahi',     price: 120, unit: 'kg',     stock: 35,  desc: 'Thick strained Greek yogurt, high in protein.',                    img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format' },
  { name: 'Hung Curd (Chakka)',     subcategory: 'curd-dahi',     price: 100, unit: 'kg',     stock: 30,  desc: 'Strained hung curd, perfect for dips and shrikhand.',              img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format' },
  { name: 'Probiotic Dahi',         subcategory: 'curd-dahi',     price: 90,  unit: 'kg',     stock: 45,  desc: 'Probiotic-rich curd for gut health.',                               img: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format' },

  // ── Drinks ──
  { name: 'Buttermilk (Chaas)',     subcategory: 'drinks',        price: 40,  unit: 'litre',  stock: 80,  desc: 'Fresh spiced buttermilk, cooling and digestive.',                  img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&auto=format' },
  { name: 'Sweet Lassi',            subcategory: 'drinks',        price: 50,  unit: 'litre',  stock: 60,  desc: 'Thick sweet lassi, chilled and refreshing.',                        img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format' },
  { name: 'Salted Lassi',           subcategory: 'drinks',        price: 50,  unit: 'litre',  stock: 60,  desc: 'Tangy salted lassi with roasted cumin.',                            img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format' },
  { name: 'Mango Lassi',            subcategory: 'drinks',        price: 70,  unit: 'litre',  stock: 40,  desc: 'Creamy mango lassi, summer favourite.',                             img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format' },
  { name: 'Rose Lassi',             subcategory: 'drinks',        price: 65,  unit: 'litre',  stock: 35,  desc: 'Fragrant rose lassi, a Punjabi classic.',                           img: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format' },
  { name: 'Shrikhand',              subcategory: 'drinks',        price: 180, unit: 'kg',     stock: 25,  desc: 'Sweet strained yogurt dessert with saffron and cardamom.',          img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&auto=format' },
  { name: 'Rabri',                  subcategory: 'drinks',        price: 200, unit: 'kg',     stock: 20,  desc: 'Thick condensed milk dessert with dry fruits.',                     img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format' },
  { name: 'Kheer Mix',              subcategory: 'drinks',        price: 150, unit: 'kg',     stock: 30,  desc: 'Ready-to-cook kheer mix with rice and milk.',                       img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format' },
];

async function seedDairyProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kshirva');
    console.log('✅ Connected to MongoDB\n');

    const farmer = await Farmer.findOne();
    if (!farmer) { console.log('❌ No farmer found. Run setupAllUsers.js first'); process.exit(1); }
    console.log(`Using farmer: ${farmer.farmName}\n`);

    await Product.deleteMany({ category: 'dairy' });
    console.log('🗑️  Cleared existing dairy products\n');

    let added = 0;
    for (const p of dairyProducts) {
      await new Product({
        farmer: farmer._id,
        name: p.name,
        description: p.desc,
        category: 'dairy',
        subcategory: p.subcategory,
        price:    { amount: p.price, unit: p.unit },
        stock:    { quantity: p.stock, unit: p.unit, lowStockThreshold: 10 },
        images:   [{ url: p.img, alt: p.name }],
        freshness:      { harvestDate: new Date(), freshnessScore: 95 },
        farmingDetails: { method: 'organic', isOrganic: true },
        availability:   { isAvailable: true },
        rating: { average: +(4 + Math.random()).toFixed(1), count: Math.floor(Math.random() * 80) + 10 },
        isActive: true,
      }).save();
      added++;
      console.log(`✅ ${p.name}`);
    }

    console.log(`\n🎉 Successfully added ${added} dairy products!`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedDairyProducts();
