# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["SimpleNotesApi.csproj", "./"]
RUN dotnet restore "SimpleNotesApi.csproj"

# Copy remaining files and build app
COPY . .
RUN dotnet build "SimpleNotesApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "SimpleNotesApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SimpleNotesApi.dll"]
