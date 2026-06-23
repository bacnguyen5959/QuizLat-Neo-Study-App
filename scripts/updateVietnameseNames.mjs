import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB1K2PWWWkHnFh7uhlNnjxIhYsD44eiETA",
  authDomain: "quizlet-55b7b.firebaseapp.com",
  projectId: "quizlet-55b7b",
  storageBucket: "quizlet-55b7b.firebasestorage.app",
  messagingSenderId: "410716271757",
  appId: "1:410716271757:web:2eda5ee4cd2aede0791ec4",
  measurementId: "G-7YNY7B1JT7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const vietnameseNames = [
  "Nguyễn Văn An", "Trần Thị Bé", "Lê Hoàng Phúc", "Phạm Minh Tâm", 
  "Hoàng Quốc Bảo", "Đặng Thị Mai", "Bùi Trọng Nghĩa", "Đỗ Hải Yến", 
  "Hồ Văn Thắng", "Ngô Phương Thảo", "Đinh Tuấn Kiệt", "Lý Thu Phương",
  "Trương Đức Hải", "Mai Văn Hùng", "Võ Minh Trí", "Phan Thanh Tùng",
  "Vũ Khắc Tiệp", "Huỳnh Văn Thái", "Đoàn Nhật Nam", "Lâm Quốc Việt",
  "Nguyễn Cẩm Ly", "Lê Thanh Sơn", "Phạm Thúy Hằng", "Bùi Bích Thủy"
];

async function updateNames() {
  console.log("Fetching users...");
  const usersSnap = await getDocs(collection(db, 'users'));
  const docs = usersSnap.docs;
  console.log(`Found ${docs.length} users.`);

  for (let i = 0; i < docs.length; i++) {
    const userDoc = docs[i];
    const data = userDoc.data();
    // if (!data.displayName) {
      const randomName = vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)];
      await updateDoc(doc(db, 'users', userDoc.id), {
        displayName: randomName
      });
      console.log(`Updated user ${data.email} -> ${randomName}`);
    // }
  }
  console.log("Done updating Vietnamese names!");
  process.exit(0);
}

updateNames().catch(console.error);
