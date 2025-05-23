## كود التقييم التلقائي

```js
const rating = prompt("ادخل رقم بين 1 و 5، حيث 1 = سيء، و5 = ممتاز"); // مدخلات المستخدم
document.querySelectorAll('input[value="' + rating + '"]').forEach((e) => e.click()); // ضغط ازرار التقييم
document.querySelector('input[type="submit"]').click(); // ضغط زر التسليم
```


