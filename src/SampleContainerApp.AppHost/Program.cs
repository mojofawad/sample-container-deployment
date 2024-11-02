var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres");
var pgdb = postgres.AddDatabase("pgdb");

var api = builder.AddProject<Projects.SampleContainerApp_Api>("api")
    .WithEndpoint(port: 5000, scheme: "http")  // Explicitly set HTTP
    .WithEnvironment("ASPNETCORE_URLS", "http://*:8080")
    .WithReference(pgdb)
    .WithExternalHttpEndpoints();

builder.AddNpmApp("next-app", "../SampleContainerApp.Web")
    .WithReference(api)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
