## كود التقييم التلقائي

```js
const rating = prompt("ادخل رقم بين 1 و 5، حيث 1 = سيء، و5 = ممتاز"); // مدخلات المستخدم
document.querySelectorAll('input[value="' + rating + '"]').forEach((e) => e.click()); // ضغط ازرار التقييم
document.querySelector('input[type="submit"]').click(); // ضغط زر التسليم
```

#### طريقة الاستعممال:

ادخل على صفحة تقييم المقرر >> اضغط كلك يمين في اي مكان فارغ >> اختار "inspect" او بالعربي "فحص" >> اختار "console" او بالعربي "لوحة التحكم" >> الصق الكود في خانة الكتابة >> ارسل (اضغط Enter) >> اكتب التقييم >> اضغط Ok

   
![image](https://github.com/user-attachments/assets/fd8e9fd5-f019-4220-9331-4f0be253ae67)
![image](https://github.com/user-attachments/assets/78c7dd89-5ca7-4189-ac2f-e53faa8ca105)
