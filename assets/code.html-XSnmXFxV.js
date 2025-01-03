import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as s,o as r,c as n,a as e,b as i,d as o,e as a}from"./app-DCDZL_En.js";const c="/GetUrCourses_labs/assets/Lab4_Auth1-CEdJtmKT.png",p="/GetUrCourses_labs/assets/Lab4_Payment-DEtIVWXC.png",d="/GetUrCourses_labs/assets/Lab4_Notification-Cs52YQeW.png",h="/GetUrCourses_labs/assets/Lab4_Course-DHj4mL5w.png",u="/GetUrCourses_labs/assets/Lab4_Task-hub8iyU5.png",g="/GetUrCourses_labs/assets/Lab4_User-C8FC67iK.png",m="/GetUrCourses_labs/assets/Lab4_ChatAPI-Cgpx-a7c.png",_="/GetUrCourses_labs/assets/Lab4_Auth_Case-hYMbn0JJ.jpg",f="/GetUrCourses_labs/assets/Lab4_Auth2-D0ZA06-7.jpg",b="/GetUrCourses_labs/assets/Lab4_Auth3-DWjzHdgF.jpg",C="/GetUrCourses_labs/assets/Lab4_Auth4-Dxfppyvm.jpg",y={},x=a('<h1 id="розробка-базовоі-структури-коду" tabindex="-1"><a class="header-anchor" href="#розробка-базовоі-структури-коду"><span>Розробка базової структури коду</span></a></h1><h2 id="підготовка-до-розробки" tabindex="-1"><a class="header-anchor" href="#підготовка-до-розробки"><span>Підготовка до розробки</span></a></h2><p>Після аналізу архітектури, use cases та функціональних/нефункціональних вимог було обрано відповідні бібліотеки та сформовані основні вимоги до написання чистого, маштабованого коду за принцами SOLID, CQRS, DRY, KISS та інших парадигм. Через складність реалізації обміну повідомленнями між сервісами за допомогою Kafka та маштабності системи, було обрано RabbitMQ в якості брокеру для спілкування частин платформи. А також цей інструмент допоможе швидше надати MVP проєкту.</p><h2 id="розробка-коду" tabindex="-1"><a class="header-anchor" href="#розробка-коду"><span>Розробка коду</span></a></h2><p>Для цього етапу виконання роботи було виділено наступні сервіси:</p><ul><li>Auth Service</li><li>Payment Service</li><li>Notification Service</li><li>Chat Service</li><li>Course Service</li><li>Task Service</li><li>User Service</li></ul><h3 id="auth" tabindex="-1"><a class="header-anchor" href="#auth"><span>Auth</span></a></h3><figure><img src="'+c+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>До проекту входять наступні файли та директорії:</p><ul><li>Program.cs, де знаходяться всі налаштування проекту</li><li>Controllers, це директорія де можна побачити основну логіку для реєстрації/аутентифікації користувачів системи</li><li>Services, папка в якій є сервіс для реєстрації/аутентифікації</li><li>Entities, тека, де є модель користувача</li><li>DTOs, директорія, в якій містяться моделі для перенесення інформації від користувачів до серверу</li></ul><h3 id="payment" tabindex="-1"><a class="header-anchor" href="#payment"><span>Payment</span></a></h3><figure><img src="'+p+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>До проекту входять наступні файли та директорії:</p><ul><li>Program.cs, де знаходяться всі налаштування проекту</li><li>Controllers, це директорія де знаходиться логіка роботи сплати в системі</li><li>Services, папка в якій є сервіс для роботи з зовнішнім API</li><li>Entities, тека, де є модель умовного чеку після плати</li><li>DTOs, директорія, в якій містяться моделі для перенесення інформації від користувачів до серверу</li></ul><h3 id="notification" tabindex="-1"><a class="header-anchor" href="#notification"><span>Notification</span></a></h3><figure><img src="'+d+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>До проекту входять наступні файли та директорії:</p><ul><li>Program.cs, де знаходяться всі налаштування проекту</li><li>Controllers, це директорія де є бізнес логіка для відпралення повідомлень користувачам по email</li><li>Infrastructure, папка в якій є сервіси для роботи з зовнішнім API</li><li>Templates, тека, де є всі шаблони для повідомлень, які можуть надходити до користувачів</li><li>DTOs, директорія, в якій містяться моделі для перенесення інформації від користувачів до серверу</li></ul><h3 id="course" tabindex="-1"><a class="header-anchor" href="#course"><span>Course</span></a></h3><figure><img src="'+h+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>До проекту входять наступні файли та директорії:</p><ul><li>Program.cs, де знаходяться всі налаштування проекту</li><li>Core, директорія в якій є доменні моделі сервісу та їх базова бізнес логіка</li><li>Application, тека де є реалізація бізнес логіки з застосування паттерну CQRS та сторонніх сервісів</li><li>Infrastructure, папка, в якій розміщена реалізація доступу до бази данних та кешування</li><li>Shared, директорія, в якій містяться допоміжні класи сервісу</li></ul><h3 id="task" tabindex="-1"><a class="header-anchor" href="#task"><span>Task</span></a></h3><figure><img src="'+u+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>До проекту входять наступні файли та директорії:</p><ul><li>Program.cs, де знаходяться всі налаштування проекту</li><li>Controllers, це директорія де можна побачити логіку збереження робіт студентів</li><li>Services, папка в якій є сервіс для завантаження робіт в папку UploadedFiles</li><li>Models, тека, де є модель для файлу, а також dto для отримання інформації про користувача</li><li>Interfaces, директорія, де є інтерфейс для збереження робіт</li></ul><h3 id="user" tabindex="-1"><a class="header-anchor" href="#user"><span>User</span></a></h3><figure><img src="'+g+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Проект складається з таких файлів і директорій:</p><ul><li>Program.cs — файл, у якому містяться всі налаштування проекту</li><li>Core — директорія, що містить доменні моделі сервісу та базову бізнес-логіку</li><li>Application — папка, де реалізована бізнес-логіка з використанням патерну CQRS та інтеграція зі сторонніми сервісами</li><li>Infrastructure — директорія, яка включає реалізацію доступу до бази даних та механізми кешування</li><li>Shared — папка з допоміжними класами та утилітами для підтримки роботи сервісу</li></ul><h3 id="chat" tabindex="-1"><a class="header-anchor" href="#chat"><span>Chat</span></a></h3><figure><img src="'+m+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Проект складається з таких файлів і директорій:</p><ul><li>Program.cs, де знаходяться всі налаштування проекту</li><li>Controllers, це директорія де є бізнес логіка для чату між корисувачами</li><li>Models, папка в якій є модель повідомлення</li><li>Repository, тека, де є інтерфейси, які потрібні для бізнес логіки</li></ul><h2 id="використання-git" tabindex="-1"><a class="header-anchor" href="#використання-git"><span>Використання Git</span></a></h2>',35),k={href:"https://github.com/D0wnfal1/GetUrCourse",target:"_blank",rel:"noopener noreferrer"},v=a('<h2 id="опис-результатів" tabindex="-1"><a class="header-anchor" href="#опис-результатів"><span>Опис результатів</span></a></h2><p>Детально розглянемо use case з реєстрацією та аутентифікацією: <img src="'+_+'" alt="" loading="lazy"> Тут ми можемо побачити, що після того, як користувач зареєструвався викликається метод Publish в який передається AddUser. Ця інформація передається в MassTransit(RabbitMQ). А також відбувається перевірка на те, чи додано користувача до бази даних, та на те чи прийшло повідомлення до кристувача, а перевіряється це все в Saga. Якщо якийсь сервіс перестає працювати, то Saga надсидає компенсуючу транзакцію. <img src="'+f+'" alt="" loading="lazy"> Тут можна побачити, що користувача додано до бази даних і також це можна побачити по логах в консолі. Окрім цього тут видно, що закінчилася подія додавання користувача. <img src="'+b+'" alt="" loading="lazy"> А на цьому скріншоті видно, що користувачу було надіслано email на його пошту. <img src="'+C+'" alt="" loading="lazy"> Можна побачити, що в Saga все пройшло та користувача було успішно додано та повідомленно по пошті</p>',2);function S(U,P){const t=s("ExternalLinkIcon");return r(),n("div",null,[x,e("p",null,[i("Детально з файлами проєкту можна ознайомитися за "),e("a",k,[i("посиланням"),o(t)])]),v])}const G=l(y,[["render",S],["__file","code.html.vue"]]),L=JSON.parse('{"path":"/code/code.html","title":"Розробка базової структури коду","lang":"en-US","frontmatter":{"description":"Розробка базової структури коду Підготовка до розробки Після аналізу архітектури, use cases та функціональних/нефункціональних вимог було обрано відповідні бібліотеки та сформов...","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/GetUrCourses_labs/code/code.html"}],["meta",{"property":"og:site_name","content":"GetUrCourse"}],["meta",{"property":"og:title","content":"Розробка базової структури коду"}],["meta",{"property":"og:description","content":"Розробка базової структури коду Підготовка до розробки Після аналізу архітектури, use cases та функціональних/нефункціональних вимог було обрано відповідні бібліотеки та сформов..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-12-27T07:37:13.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-27T07:37:13.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Розробка базової структури коду\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-27T07:37:13.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Підготовка до розробки","slug":"підготовка-до-розробки","link":"#підготовка-до-розробки","children":[]},{"level":2,"title":"Розробка коду","slug":"розробка-коду","link":"#розробка-коду","children":[{"level":3,"title":"Auth","slug":"auth","link":"#auth","children":[]},{"level":3,"title":"Payment","slug":"payment","link":"#payment","children":[]},{"level":3,"title":"Notification","slug":"notification","link":"#notification","children":[]},{"level":3,"title":"Course","slug":"course","link":"#course","children":[]},{"level":3,"title":"Task","slug":"task","link":"#task","children":[]},{"level":3,"title":"User","slug":"user","link":"#user","children":[]},{"level":3,"title":"Chat","slug":"chat","link":"#chat","children":[]}]},{"level":2,"title":"Використання Git","slug":"використання-git","link":"#використання-git","children":[]},{"level":2,"title":"Опис результатів","slug":"опис-результатів","link":"#опис-результатів","children":[]}],"git":{"createdTime":1735285033000,"updatedTime":1735285033000,"contributors":[{"name":"maksimbilyk","email":"pdo090318@gmail.com","commits":1}]},"readingTime":{"minutes":2.15,"words":644},"filePathRelative":"code/code.md","localizedDate":"December 27, 2024","autoDesc":true}');export{G as comp,L as data};