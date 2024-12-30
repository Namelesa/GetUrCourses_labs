#  Інтеграція компонентів та управління залежностями

## Підготовка до інтеграції
Підготовка до інтеграції є важливим етапом, що забезпечує успішне об’єднання всіх компонентів проекту в єдину функціональну систему. На цьому етапі було зроблено наступне:
- Проаналізовано вимоги (функціональні/нефункціональні)  
- Перевірено готовність компонентів  
- Протестовано модулі  
- Підготовлено середовище інтеграції, а саме Docker  
 
## Налаштування управління залежностями  
Для управління залежностями та забезпечення сумісності компонентів в проекті GetUrCourse було використано наступні інструменти та підходи:
- Контейнеризація з Docker. Усі мікросервіси проекту ізольовані за допомогою Docker. Кожен сервіс має власний Dockerfile, який визначає залежності, середовище виконання та процедури побудови. Це забезпечує стабільність середовища, незалежність від конфігурацій локальної машини та можливість розгортання на різних платформах.  
- Управління залежностями в .NET Core. У кожному проекті вказані залежності в файлах .csproj. Для віддалених бібліотек використовується dotnet restore, який завантажує необхідні пакети з NuGet. Синхронізація версій залежностей досягнута завдяки централізованому управлінню спільними бібліотеками через проект GetUrCourse.Contracts.  
- Оновлення залежностей та перевірка сумісності Перед інтеграцією всі залежності були оновлені до останніх стабільних версій для забезпечення безпеки та продуктивності. Для перевірки сумісності використовувались автоматичні тести, що гарантують коректну роботу сервісів навіть після оновлення залежностей.
- Мікросервісна архітектура та комунікація. Завдяки використанню брокера повідомлень та REST API, взаємодія між сервісами не залежить від їх реалізації. Це дозволяє уникати жорстких залежностей та легко масштабувати проект.  
- Інструменти CI/CD. Для автоматизації оновлення залежностей та перевірки працездатності проекту були налаштовані CI/CD процеси на основі GitHub Actions. Це дозволяє:
    - Виконувати перевірку збірки для кожного сервісу.  
    - Проводити інтеграційні тести для перевірки коректності взаємодії між модулями.  
    - Публікувати оновлені образи в Docker Registry.  
Orchestrator
```csharp
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Orchestrator/GetUrCourse.Orchestrator.csproj", "GetUrCourse.Orchestrator/"]
COPY ["GetUrCourse.Contracts/GetUrCourse.Contracts.csproj", "GetUrCourse.Contracts/"]
RUN dotnet restore "GetUrCourse.Orchestrator/GetUrCourse.Orchestrator.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Orchestrator"
RUN dotnet build "GetUrCourse.Orchestrator.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GetUrCourse.Orchestrator.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Orchestrator.dll"]
```  
UserService
``` csharp
# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.UserAPI/GetUrCourse.Services.UserAPI.csproj", "GetUrCourse.Services.UserAPI/"]
COPY ["GetUrCourse.Contracts/GetUrCourse.Contracts.csproj", "GetUrCourse.Contracts/"]
RUN dotnet restore "./GetUrCourse.Services.UserAPI/GetUrCourse.Services.UserAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.UserAPI"
RUN dotnet build "./GetUrCourse.Services.UserAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./GetUrCourse.Services.UserAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Services.UserAPI.dll"]
```  
TaskService
``` csharp
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.TaskAPI/GetUrCourse.Services.TaskAPI.csproj", "GetUrCourse.Services.TaskAPI/"]
RUN dotnet restore "GetUrCourse.Services.TaskAPI/GetUrCourse.Services.TaskAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.TaskAPI"
RUN dotnet build "GetUrCourse.Services.TaskAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GetUrCourse.Services.TaskAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Services.TaskAPI.dll"]
```
PaymentService
``` csharp
# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.PaymentAPI/GetUrCourse.Services.PaymentAPI.csproj", "GetUrCourse.Services.PaymentAPI/"]
RUN dotnet restore "./GetUrCourse.Services.PaymentAPI/GetUrCourse.Services.PaymentAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.PaymentAPI"
RUN dotnet build "./GetUrCourse.Services.PaymentAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./GetUrCourse.Services.PaymentAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Services.PaymentAPI.dll"]
```  

NotificationService
``` csharp
# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.NotificationAPI/GetUrCourse.Services.NotificationAPI.csproj", "GetUrCourse.Services.NotificationAPI/"]
COPY ["GetUrCourse.Contracts/GetUrCourse.Contracts.csproj", "GetUrCourse.Contracts/"]
RUN dotnet restore "./GetUrCourse.Services.NotificationAPI/GetUrCourse.Services.NotificationAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.NotificationAPI"
RUN dotnet build "./GetUrCourse.Services.NotificationAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./GetUrCourse.Services.NotificationAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY ["GetUrCourse.Services.NotificationAPI/Template", "./Template"]
ENTRYPOINT ["dotnet", "GetUrCourse.Services.NotificationAPI.dll"]
```  

CourseService
``` csharp
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.CourseAPI/GetUrCourse.Services.CourseAPI.csproj", "GetUrCourse.Services.CourseAPI/"]
RUN dotnet restore "GetUrCourse.Services.CourseAPI/GetUrCourse.Services.CourseAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.CourseAPI"
RUN dotnet build "GetUrCourse.Services.CourseAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GetUrCourse.Services.CourseAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Services.CourseAPI.dll"]
```  

ChatService
``` csharp
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.ChatAPI/GetUrCourse.Services.ChatAPI.csproj", "GetUrCourse.Services.ChatAPI/"]
RUN dotnet restore "GetUrCourse.Services.ChatAPI/GetUrCourse.Services.ChatAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.ChatAPI"
RUN dotnet build "GetUrCourse.Services.ChatAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GetUrCourse.Services.ChatAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Services.ChatAPI.dll"]
```  

AuthService
``` csharp
# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GetUrCourse.Services.AuthAPI/GetUrCourse.Services.AuthAPI.csproj", "GetUrCourse.Services.AuthAPI/"]
COPY ["GetUrCourse.Contracts/GetUrCourse.Contracts.csproj", "GetUrCourse.Contracts/"]
RUN dotnet restore "./GetUrCourse.Services.AuthAPI/GetUrCourse.Services.AuthAPI.csproj"
COPY . .
WORKDIR "/src/GetUrCourse.Services.AuthAPI"
RUN dotnet build "./GetUrCourse.Services.AuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./GetUrCourse.Services.AuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetUrCourse.Services.AuthAPI.dll"]
```

docker-compose.yml
```csharp
services:
  # Services Payment Apidocker
  geturcourse-services-payment-api:
    build: GetUrCourse.Services.PaymentAPI/
    container_name: 'geturcourse-services-payment-api'
    restart: always
    ports:
      - "5583:8080"  
    environment:
      - "ConnectionStrings:DefaultConnection=Host=geturcourse-auth-db;Database=geturcourse_auth_db;Username=postgres;Password=docker"
    depends_on:
      - geturcourse-payment-db

  # Payment Db
  geturcourse-payment-db:
    image: "postgres:latest"
    container_name: 'geturcourse-payment-db'
    restart: always
    ports:
      - "5433:5432"  
    environment:
      - POSTGRES_PASSWORD=docker
      - POSTGRES_USER=postgres
      - POSTGRES_DB=geturcourse_payment_db
    volumes:
      - geturcourse-payment-db-data:/var/lib/postgresql/data 
    healthcheck:
      test: ["CMD", "pg_isready", "-h", "localhost", "-U", "postgres"]
      interval: 30s
      retries: 5
      timeout: 10s

  # Redis service
  promocode-factory-redis:
    image: "redis:alpine"
    container_name: 'geturcourse-redis'
    restart: always
    ports:
      - "6379:6379"  
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      retries: 5
      timeout: 10s
    
  authService:
    image: geturcourse/auth
    container_name: GetUrCourse.Auth
    build:
      context: .
      dockerfile: src/GetUrCourse.Auth/Dockerfile
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Release
    depends_on:
      - rabbitmq
      - rabbitPostgres
      - authPostgres
  
  authPostgres:
    image: postgres:latest
    container_name: GetUrCourse.AuthPostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=auth
    ports: 
      - "5229:5432"
    volumes:
      - GetUrCourse.AuthPostgres:/var/lib/postgresql/data
  
  
  notificationService:
    image: geturcourse/notification
    container_name: GetUrCourse.Notification
    build:
      context: .
      dockerfile: src/GetUrCourse.Notification/Dockerfile
    ports:
      - "5001:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - rabbitmq
      - rabbitPostgres
  
  notificationPostgres:
    image: postgres:latest
    container_name: GetUrCourse.NotificationPostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=notification
    ports:
      - "5231:5432"
    volumes:
      - GetUrCourse.NotificationPostgres:/var/lib/postgresql/data
  
  userService:
    image: geturcourse/user
    container_name: GetUrCourse.User
    build:
      context: .
      dockerfile: src/GetUrCourse.User/Dockerfile
    ports:
      - "5002:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - rabbitmq
      - rabbitPostgres
      - userPostgres
  
  userPostgres:
    image: postgres:latest
    container_name: GetUrCourse.UserPostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=user
    ports:
      - "5230:5432"
    volumes:
      - GetUrCourse.UserPostgres:/var/lib/postgresql/data
  
  taskService:
    image: geturcourse/user
    container_name: GetUrCourse.User
    build:
      context: .
      dockerfile: src/GetUrCourse.User/Dockerfile
    ports:
      - "5002:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - rabbitmq
      - rabbitPostgres
      - userPostgres
  
  taskPostgres:
    image: postgres:latest
    container_name: GetUrCourse.UserPostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=user
    ports:
      - "5230:5432"
    volumes:
      - GetUrCourse.UserPostgres:/var/lib/postgresql/data
  
  courseService:
    image: geturcourse/course
    container_name: GetUrCourse.Course
    build:
      context: .
      dockerfile: src/GetUrCourse.Course/Dockerfile
    ports:
      - "5004:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - rabbitmq
      - rabbitPostgres
      - coursePostgres
  
  coursePostgres:
    image: postgres:latest
    container_name: GetUrCourse.CoursePostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=course
    ports:
      - "5232:5432"
    volumes:
      - GetUrCourse.CoursePostgres:/var/lib/postgresql/data
  
  chatService:
    image: geturcourse/chat
    container_name: GetUrCourse.Chat
    build:
      context: .
      dockerfile: src/GetUrCourse.Chat/Dockerfile
    ports:
      - "5005:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - rabbitmq
      - rabbitPostgres
      - chatPostgres
  
  chatPostgres:
    image: postgres:latest
    container_name: GetUrCourse.ChatPostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=chat
    ports:
      - "5233:5432"
    volumes:
      - GetUrCourse.ChatPostgres:/var/lib/postgresql/data
  
  orchestrator:
    image: geturcourse/orchestrator
    container_name: GetUrCourse.Orchestrator
    build:
      context: .
      dockerfile: src/GetUrCourse.Orchestrator/Dockerfile
    ports:
      - "5003:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - rabbitmq
      - rabbitPostgres

  rabbitmq:
    image: masstransit/rabbitmq
    container_name: GetUrCourse.RabbitMQ
    volumes:
      - ./.container/queue/data/:/var/lib/rabbitmq  
      - ./.container/queue/log/:/var/log/rabbitmq  
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"  
      - "15672:15672" 

  rabbitPostgres:
    image: postgres:latest
    container_name: GetUrCourse.RabbitPostgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=rabbit
    ports:
      - "5228:5432"  
    volumes:
      - GetUrCourse.RabbitPostgres:/var/lib/postgresql/data

volumes:
  geturcourse-payment-db-data:
  GetUrCourse.AuthPostgres:
  GetUrCourse.NotificationPostgres:
  GetUrCourse.UserPostgres:
  GetUrCourse.CoursePostgres:
  GetUrCourse.ChatPostgres:
  GetUrCourse.RabbitPostgres:
```

## Інтеграція модулів та перевірка сумісності  
Оскільки було використано мікросервісну архітектруру, то перевіряти модулі на сумісність немамє потреби, бо в проєкті є брокер повідомлень для спілкування між сервісами. А детеальну роботу проєкту можна подивитися за [посиланням](https://drive.google.com/file/d/109QIg0GT5WcRkHUx_oivV6VDH0585HmP/view?usp=sharing)  
З відео можна побачити, що брокер працює так як потрібно, тому можна сказати, що інтеграція компонентів успішна.
## Завантаження в репозиторій на GitHub  
Детально з файлами проєкту можна ознайомитися за [посиланням](https://github.com/D0wnfal1/GetUrCourse)  