import cron from "node-cron";
import axios from "axios";

cron.schedule("0 4 * * *", async () => {
  console.log("⏰ Menjalankan rekap LKP harian...");
  try {
    await axios.post("https://backend-lms-panglima.vercel.app/api/lkp/rekap");
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Gagal rekap harian", err.message);
    } else {
      console.error("❌ Gagal rekap harian", err);
    }
  }
});
