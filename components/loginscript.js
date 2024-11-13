document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.querySelector(".error-message");

  // เชื่อมต่อกับ Supabase
  const SUPABASE_URL = 'https://qkiwwxenhfogpaetmxkk.supabase.co'; // ใส่ URL ของโปรเจกต์ Supabase ของคุณ
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFraXd3eGVuaGZvZ3BhZXRteGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNTQyODAsImV4cCI6MjA0NjczMDI4MH0.pCGKLBQIr8QhXCTzIs_NjP9McB7sdZeTHo2fp3VW0pI'; // ใส่ Key ของโปรเจกต์ Supabase ของคุณ

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ
    errorMessage.textContent = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
      errorMessage.textContent = "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }

    try {
      // เรียกใช้ Supabase เพื่อเข้าสู่ระบบ
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // ใช้ username เป็นอีเมล
        password: password,
      });

      if (error) {
        errorMessage.textContent = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        return;
      }

      // ตรวจสอบบทบาทของผู้ใช้ในฐานข้อมูล
      const { user, error: userError } = await supabase
        .from('users') // ชื่อตารางในฐานข้อมูลของคุณ
        .select('role')
        .eq('id', data.user.id) // ตรวจสอบจาก ID ของผู้ใช้ที่เข้าสู่ระบบ
        .single();

      if (userError) {
        errorMessage.textContent = "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้";
        return;
      }

      // ตรวจสอบบทบาทของผู้ใช้และเปลี่ยนเส้นทางไปยังแดชบอร์ดที่เหมาะสม
      if (user.usertype === 1) {
        window.location.href = "student-dashboard.html";
      } else if (user.usertype === 2) {
        window.location.href = "teacher-dashboard.html";
      } else if (user.usertype === 3) {
        window.location.href = "admin-dashboard.html";
      }
    } catch (error) {
      errorMessage.textContent = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
    }
  });
});