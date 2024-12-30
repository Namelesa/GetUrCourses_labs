import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as p,c as i,a as s,b as n,d as e,e as c}from"./app-Br68MbwD.js";const r={},l=c(`<h1 id="інтеграція-компонентів-та-управління-залежностями" tabindex="-1"><a class="header-anchor" href="#інтеграція-компонентів-та-управління-залежностями"><span>Інтеграція компонентів та управління залежностями</span></a></h1><h2 id="підготовка-до-інтеграціі" tabindex="-1"><a class="header-anchor" href="#підготовка-до-інтеграціі"><span>Підготовка до інтеграції</span></a></h2><p>Підготовка до інтеграції є важливим етапом, що забезпечує успішне об’єднання всіх компонентів проекту в єдину функціональну систему. На цьому етапі було зроблено наступне:</p><ul><li>Проаналізовано вимоги (функціональні/нефункціональні)</li><li>Перевірено готовність компонентів</li><li>Протестовано модулі</li><li>Підготовлено середовище інтеграції, а саме Docker</li></ul><h2 id="налаштування-управління-залежностями" tabindex="-1"><a class="header-anchor" href="#налаштування-управління-залежностями"><span>Налаштування управління залежностями</span></a></h2><p>Для управління залежностями та забезпечення сумісності компонентів в проекті GetUrCourse було використано наступні інструменти та підходи:</p><ul><li>Контейнеризація з Docker. Усі мікросервіси проекту ізольовані за допомогою Docker. Кожен сервіс має власний Dockerfile, який визначає залежності, середовище виконання та процедури побудови. Це забезпечує стабільність середовища, незалежність від конфігурацій локальної машини та можливість розгортання на різних платформах.</li><li>Управління залежностями в .NET Core. У кожному проекті вказані залежності в файлах .csproj. Для віддалених бібліотек використовується dotnet restore, який завантажує необхідні пакети з NuGet. Синхронізація версій залежностей досягнута завдяки централізованому управлінню спільними бібліотеками через проект GetUrCourse.Contracts.</li><li>Оновлення залежностей та перевірка сумісності Перед інтеграцією всі залежності були оновлені до останніх стабільних версій для забезпечення безпеки та продуктивності. Для перевірки сумісності використовувались автоматичні тести, що гарантують коректну роботу сервісів навіть після оновлення залежностей.</li><li>Мікросервісна архітектура та комунікація. Завдяки використанню брокера повідомлень та REST API, взаємодія між сервісами не залежить від їх реалізації. Це дозволяє уникати жорстких залежностей та легко масштабувати проект.</li><li>Інструменти CI/CD. Для автоматизації оновлення залежностей та перевірки працездатності проекту були налаштовані CI/CD процеси на основі GitHub Actions. Це дозволяє: <ul><li>Виконувати перевірку збірки для кожного сервісу.</li><li>Проводити інтеграційні тести для перевірки коректності взаємодії між модулями.</li><li>Публікувати оновлені образи в Docker Registry.<br> Orchestrator</li></ul></li></ul><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code>FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>

FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Orchestrator/GetUrCourse.Orchestrator.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Orchestrator/&quot;</span><span class="token punctuation">]</span>
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Contracts/GetUrCourse.Contracts.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Contracts/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;GetUrCourse.Orchestrator/GetUrCourse.Orchestrator.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Orchestrator&quot;</span>
RUN dotnet build <span class="token string">&quot;GetUrCourse.Orchestrator.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;GetUrCourse.Orchestrator.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Orchestrator.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>UserService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code><span class="token preprocessor property"># See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.</span>

<span class="token preprocessor property"># This stage is used when running from VS in </span><span class="token return-type class-name">fast</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">for</span> <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>


<span class="token preprocessor property"># This stage is used to build the service project</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.UserAPI/GetUrCourse.Services.UserAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.UserAPI/&quot;</span><span class="token punctuation">]</span>
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Contracts/GetUrCourse.Contracts.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Contracts/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;./GetUrCourse.Services.UserAPI/GetUrCourse.Services.UserAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.UserAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;./GetUrCourse.Services.UserAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

<span class="token preprocessor property"># This stage is used to publish the service project to be copied to the final stage</span>
FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;./GetUrCourse.Services.UserAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

<span class="token preprocessor property"># This stage is used in production or when running from VS in </span><span class="token return-type class-name">regular</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">when</span> <span class="token keyword">not</span> <span class="token keyword">using</span> the <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.UserAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TaskService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code>FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>

FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.TaskAPI/GetUrCourse.Services.TaskAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.TaskAPI/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;GetUrCourse.Services.TaskAPI/GetUrCourse.Services.TaskAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.TaskAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;GetUrCourse.Services.TaskAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;GetUrCourse.Services.TaskAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.TaskAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>PaymentService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code><span class="token preprocessor property"># See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.</span>

<span class="token preprocessor property"># This stage is used when running from VS in </span><span class="token return-type class-name">fast</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">for</span> <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>


<span class="token preprocessor property"># This stage is used to build the service project</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.PaymentAPI/GetUrCourse.Services.PaymentAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.PaymentAPI/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;./GetUrCourse.Services.PaymentAPI/GetUrCourse.Services.PaymentAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.PaymentAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;./GetUrCourse.Services.PaymentAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

<span class="token preprocessor property"># This stage is used to publish the service project to be copied to the final stage</span>
FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;./GetUrCourse.Services.PaymentAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

<span class="token preprocessor property"># This stage is used in production or when running from VS in </span><span class="token return-type class-name">regular</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">when</span> <span class="token keyword">not</span> <span class="token keyword">using</span> the <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.PaymentAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>NotificationService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code><span class="token preprocessor property"># See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.</span>

<span class="token preprocessor property"># This stage is used when running from VS in </span><span class="token return-type class-name">fast</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">for</span> <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>


<span class="token preprocessor property"># This stage is used to build the service project</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.NotificationAPI/GetUrCourse.Services.NotificationAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.NotificationAPI/&quot;</span><span class="token punctuation">]</span>
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Contracts/GetUrCourse.Contracts.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Contracts/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;./GetUrCourse.Services.NotificationAPI/GetUrCourse.Services.NotificationAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.NotificationAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;./GetUrCourse.Services.NotificationAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

<span class="token preprocessor property"># This stage is used to publish the service project to be copied to the final stage</span>
FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;./GetUrCourse.Services.NotificationAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

<span class="token preprocessor property"># This stage is used in production or when running from VS in </span><span class="token return-type class-name">regular</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">when</span> <span class="token keyword">not</span> <span class="token keyword">using</span> the <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.NotificationAPI/Template&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;./Template&quot;</span><span class="token punctuation">]</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.NotificationAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>CourseService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code>FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>

FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.CourseAPI/GetUrCourse.Services.CourseAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.CourseAPI/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;GetUrCourse.Services.CourseAPI/GetUrCourse.Services.CourseAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.CourseAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;GetUrCourse.Services.CourseAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;GetUrCourse.Services.CourseAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.CourseAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ChatService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code>FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>

FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.ChatAPI/GetUrCourse.Services.ChatAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.ChatAPI/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;GetUrCourse.Services.ChatAPI/GetUrCourse.Services.ChatAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.ChatAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;GetUrCourse.Services.ChatAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;GetUrCourse.Services.ChatAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.ChatAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AuthService</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code><span class="token preprocessor property"># See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.</span>

<span class="token preprocessor property"># This stage is used when running from VS in </span><span class="token return-type class-name">fast</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">for</span> <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>aspnet<span class="token punctuation">:</span><span class="token number">8.0</span> AS <span class="token keyword">base</span>
USER $APP_UID
WORKDIR <span class="token operator">/</span>app
EXPOSE <span class="token number">8080</span>
EXPOSE <span class="token number">8081</span>


<span class="token preprocessor property"># This stage is used to build the service project</span>
FROM mcr<span class="token punctuation">.</span>microsoft<span class="token punctuation">.</span>com<span class="token operator">/</span>dotnet<span class="token operator">/</span>sdk<span class="token punctuation">:</span><span class="token number">8.0</span> AS build
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
WORKDIR <span class="token operator">/</span>src
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Services.AuthAPI/GetUrCourse.Services.AuthAPI.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.AuthAPI/&quot;</span><span class="token punctuation">]</span>
COPY <span class="token punctuation">[</span><span class="token string">&quot;GetUrCourse.Contracts/GetUrCourse.Contracts.csproj&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Contracts/&quot;</span><span class="token punctuation">]</span>
RUN dotnet restore <span class="token string">&quot;./GetUrCourse.Services.AuthAPI/GetUrCourse.Services.AuthAPI.csproj&quot;</span>
COPY <span class="token punctuation">.</span> <span class="token punctuation">.</span>
WORKDIR <span class="token string">&quot;/src/GetUrCourse.Services.AuthAPI&quot;</span>
RUN dotnet build <span class="token string">&quot;./GetUrCourse.Services.AuthAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>build

<span class="token preprocessor property"># This stage is used to publish the service project to be copied to the final stage</span>
FROM build AS publish
<span class="token class-name">ARG</span> BUILD_CONFIGURATION<span class="token operator">=</span>Release
RUN dotnet publish <span class="token string">&quot;./GetUrCourse.Services.AuthAPI.csproj&quot;</span> <span class="token operator">-</span>c $BUILD_CONFIGURATION <span class="token operator">-</span>o <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token operator">/</span>p<span class="token punctuation">:</span>UseAppHost<span class="token operator">=</span><span class="token boolean">false</span>

<span class="token preprocessor property"># This stage is used in production or when running from VS in </span><span class="token return-type class-name">regular</span> mode <span class="token punctuation">(</span>Default <span class="token keyword">when</span> <span class="token keyword">not</span> <span class="token keyword">using</span> the <span class="token class-name">Debug</span> configuration<span class="token punctuation">)</span>
FROM <span class="token keyword">base</span> AS final
WORKDIR <span class="token operator">/</span>app
COPY <span class="token operator">--</span>from<span class="token operator">=</span>publish <span class="token operator">/</span>app<span class="token operator">/</span>publish <span class="token punctuation">.</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;dotnet&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;GetUrCourse.Services.AuthAPI.dll&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>docker-compose.yml</p><div class="language-csharp line-numbers-mode" data-ext="cs" data-title="cs"><pre class="language-csharp"><code>services<span class="token punctuation">:</span>
  <span class="token preprocessor property"># Services Payment Apidocker</span>
  geturcourse<span class="token operator">-</span>services<span class="token operator">-</span>payment<span class="token operator">-</span>api<span class="token punctuation">:</span>
    build<span class="token punctuation">:</span> GetUrCourse<span class="token punctuation">.</span>Services<span class="token punctuation">.</span>PaymentAPI<span class="token operator">/</span>
    container_name<span class="token punctuation">:</span> &#39;geturcourse<span class="token operator">-</span>services<span class="token operator">-</span>payment<span class="token operator">-</span>api&#39;
    restart<span class="token punctuation">:</span> <span class="token class-name">always</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5583:8080&quot;</span>  
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;ConnectionStrings:DefaultConnection=Host=geturcourse-auth-db;Database=geturcourse_auth_db;Username=postgres;Password=docker&quot;</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> geturcourse<span class="token operator">-</span>payment<span class="token operator">-</span>db

  <span class="token preprocessor property"># Payment Db</span>
  geturcourse<span class="token operator">-</span>payment<span class="token operator">-</span>db<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> <span class="token string">&quot;postgres:latest&quot;</span>
    container_name<span class="token punctuation">:</span> &#39;geturcourse<span class="token operator">-</span>payment<span class="token operator">-</span>db&#39;
    restart<span class="token punctuation">:</span> <span class="token class-name">always</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5433:5432&quot;</span>  
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>docker
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">geturcourse_payment_db</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> geturcourse<span class="token operator">-</span>payment<span class="token operator">-</span>db<span class="token operator">-</span>data<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span> 
    healthcheck<span class="token punctuation">:</span>
      test<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;CMD&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;pg_isready&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-h&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;localhost&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-U&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;postgres&quot;</span><span class="token punctuation">]</span>
      interval<span class="token punctuation">:</span> 30s
      retries<span class="token punctuation">:</span> <span class="token number">5</span>
      timeout<span class="token punctuation">:</span> 10s

  <span class="token preprocessor property"># Redis service</span>
  promocode<span class="token operator">-</span>factory<span class="token operator">-</span>redis<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> <span class="token string">&quot;redis:alpine&quot;</span>
    container_name<span class="token punctuation">:</span> &#39;geturcourse<span class="token operator">-</span>redis&#39;
    restart<span class="token punctuation">:</span> <span class="token class-name">always</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;6379:6379&quot;</span>  
    healthcheck<span class="token punctuation">:</span>
      test<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;CMD&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;redis-cli&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ping&quot;</span><span class="token punctuation">]</span>
      interval<span class="token punctuation">:</span> 30s
      retries<span class="token punctuation">:</span> <span class="token number">5</span>
      timeout<span class="token punctuation">:</span> 10s
    
  authService<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">auth</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>Auth</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>Auth<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5000:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Release</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> rabbitPostgres
      <span class="token operator">-</span> <span class="token class-name">authPostgres</span>
  
  authPostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>AuthPostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">auth</span>
    ports<span class="token punctuation">:</span> 
      <span class="token operator">-</span> <span class="token string">&quot;5229:5432&quot;</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>AuthPostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>
  
  
  notificationService<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">notification</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>Notification</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>Notification<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5001:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Development</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> <span class="token class-name">rabbitPostgres</span>
  
  notificationPostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>NotificationPostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">notification</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5231:5432&quot;</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>NotificationPostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>
  
  userService<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">user</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>User</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>User<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5002:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Development</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> rabbitPostgres
      <span class="token operator">-</span> <span class="token class-name">userPostgres</span>
  
  userPostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>UserPostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">user</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5230:5432&quot;</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>UserPostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>
  
  taskService<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">user</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>User</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>User<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5002:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Development</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> rabbitPostgres
      <span class="token operator">-</span> <span class="token class-name">userPostgres</span>
  
  taskPostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>UserPostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">user</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5230:5432&quot;</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>UserPostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>
  
  courseService<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">course</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>Course</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>Course<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5004:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Development</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> rabbitPostgres
      <span class="token operator">-</span> <span class="token class-name">coursePostgres</span>
  
  coursePostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>CoursePostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">course</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5232:5432&quot;</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>CoursePostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>
  
  chatService<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">chat</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>Chat</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>Chat<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5005:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Development</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> rabbitPostgres
      <span class="token operator">-</span> <span class="token class-name">chatPostgres</span>
  
  chatPostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>ChatPostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">chat</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5233:5432&quot;</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>ChatPostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>
  
  orchestrator<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> geturcourse<span class="token operator">/</span><span class="token class-name">orchestrator</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>Orchestrator</span>
    build<span class="token punctuation">:</span>
      context<span class="token punctuation">:</span> <span class="token punctuation">.</span>
      dockerfile<span class="token punctuation">:</span> src<span class="token operator">/</span>GetUrCourse<span class="token punctuation">.</span>Orchestrator<span class="token operator">/</span><span class="token class-name">Dockerfile</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5003:80&quot;</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> ASPNETCORE_ENVIRONMENT<span class="token operator">=</span><span class="token class-name">Development</span>
    depends_on<span class="token punctuation">:</span>
      <span class="token operator">-</span> rabbitmq
      <span class="token operator">-</span> <span class="token class-name">rabbitPostgres</span>

  rabbitmq<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> masstransit<span class="token operator">/</span><span class="token class-name">rabbitmq</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>RabbitMQ</span>
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token punctuation">.</span><span class="token operator">/</span><span class="token punctuation">.</span>container<span class="token operator">/</span>queue<span class="token operator">/</span>data<span class="token operator">/</span><span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>rabbitmq  
      <span class="token operator">-</span> <span class="token punctuation">.</span><span class="token operator">/</span><span class="token punctuation">.</span>container<span class="token operator">/</span>queue<span class="token operator">/</span>log<span class="token operator">/</span><span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log<span class="token operator">/</span><span class="token class-name">rabbitmq</span>  
    environment<span class="token punctuation">:</span>
      RABBITMQ_DEFAULT_USER<span class="token punctuation">:</span> <span class="token class-name">guest</span>
      RABBITMQ_DEFAULT_PASS<span class="token punctuation">:</span> <span class="token class-name">guest</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5672:5672&quot;</span>  
      <span class="token operator">-</span> <span class="token string">&quot;15672:15672&quot;</span> 

  rabbitPostgres<span class="token punctuation">:</span>
    image<span class="token punctuation">:</span> postgres<span class="token punctuation">:</span><span class="token class-name">latest</span>
    container_name<span class="token punctuation">:</span> <span class="token class-name">GetUrCourse<span class="token punctuation">.</span>RabbitPostgres</span>
    environment<span class="token punctuation">:</span>
      <span class="token operator">-</span> POSTGRES_USER<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_PASSWORD<span class="token operator">=</span>postgres
      <span class="token operator">-</span> POSTGRES_DB<span class="token operator">=</span><span class="token class-name">rabbit</span>
    ports<span class="token punctuation">:</span>
      <span class="token operator">-</span> <span class="token string">&quot;5228:5432&quot;</span>  
    volumes<span class="token punctuation">:</span>
      <span class="token operator">-</span> GetUrCourse<span class="token punctuation">.</span>RabbitPostgres<span class="token punctuation">:</span><span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib<span class="token operator">/</span>postgresql<span class="token operator">/</span><span class="token class-name">data</span>

volumes<span class="token punctuation">:</span>
  geturcourse<span class="token operator">-</span>payment<span class="token operator">-</span>db<span class="token operator">-</span>data<span class="token punctuation">:</span>
  GetUrCourse<span class="token punctuation">.</span>AuthPostgres<span class="token punctuation">:</span>
  GetUrCourse<span class="token punctuation">.</span>NotificationPostgres<span class="token punctuation">:</span>
  GetUrCourse<span class="token punctuation">.</span>UserPostgres<span class="token punctuation">:</span>
  GetUrCourse<span class="token punctuation">.</span>CoursePostgres<span class="token punctuation">:</span>
  GetUrCourse<span class="token punctuation">.</span>ChatPostgres<span class="token punctuation">:</span>
  GetUrCourse<span class="token punctuation">.</span>RabbitPostgres<span class="token punctuation">:</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="інтеграція-модулів-та-перевірка-сумісності" tabindex="-1"><a class="header-anchor" href="#інтеграція-модулів-та-перевірка-сумісності"><span>Інтеграція модулів та перевірка сумісності</span></a></h2>`,25),u={href:"https://drive.google.com/file/d/109QIg0GT5WcRkHUx_oivV6VDH0585HmP/view?usp=sharing",target:"_blank",rel:"noopener noreferrer"},d=s("br",null,null,-1),k=s("h2",{id:"завантаження-в-репозиторіи-на-github",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#завантаження-в-репозиторіи-на-github"},[s("span",null,"Завантаження в репозиторій на GitHub")])],-1),v={href:"https://github.com/D0wnfal1/GetUrCourse",target:"_blank",rel:"noopener noreferrer"};function m(b,g){const a=o("ExternalLinkIcon");return p(),i("div",null,[l,s("p",null,[n("Оскільки було використано мікросервісну архітектруру, то перевіряти модулі на сумісність немамє потреби, бо в проєкті є брокер повідомлень для спілкування між сервісами. А детеальну роботу проєкту можна подивитися за "),s("a",u,[n("посиланням"),e(a)]),d,n(" З відео можна побачити, що брокер працює так як потрібно, тому можна сказати, що інтеграція компонентів успішна.")]),k,s("p",null,[n("Детально з файлами проєкту можна ознайомитися за "),s("a",v,[n("посиланням"),e(a)])])])}const h=t(r,[["render",m],["__file","integration.html.vue"]]),C=JSON.parse('{"path":"/integration/integration.html","title":"Інтеграція компонентів та управління залежностями","lang":"en-US","frontmatter":{"description":"Інтеграція компонентів та управління залежностями Підготовка до інтеграції Підготовка до інтеграції є важливим етапом, що забезпечує успішне об’єднання всіх компонентів проекту ...","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/GetUrCourses_labs/integration/integration.html"}],["meta",{"property":"og:site_name","content":"GetUrCourse"}],["meta",{"property":"og:title","content":"Інтеграція компонентів та управління залежностями"}],["meta",{"property":"og:description","content":"Інтеграція компонентів та управління залежностями Підготовка до інтеграції Підготовка до інтеграції є важливим етапом, що забезпечує успішне об’єднання всіх компонентів проекту ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-12-30T22:11:42.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-30T22:11:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Інтеграція компонентів та управління залежностями\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-30T22:11:42.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Підготовка до інтеграції","slug":"підготовка-до-інтеграціі","link":"#підготовка-до-інтеграціі","children":[]},{"level":2,"title":"Налаштування управління залежностями","slug":"налаштування-управління-залежностями","link":"#налаштування-управління-залежностями","children":[]},{"level":2,"title":"Інтеграція модулів та перевірка сумісності","slug":"інтеграція-модулів-та-перевірка-сумісності","link":"#інтеграція-модулів-та-перевірка-сумісності","children":[]},{"level":2,"title":"Завантаження в репозиторій на GitHub","slug":"завантаження-в-репозиторіи-на-github","link":"#завантаження-в-репозиторіи-на-github","children":[]}],"git":{"createdTime":1735596702000,"updatedTime":1735596702000,"contributors":[{"name":"maksimbilyk","email":"pdo090318@gmail.com","commits":1}]},"readingTime":{"minutes":5.68,"words":1704},"filePathRelative":"integration/integration.md","localizedDate":"December 30, 2024","autoDesc":true}');export{h as comp,C as data};
