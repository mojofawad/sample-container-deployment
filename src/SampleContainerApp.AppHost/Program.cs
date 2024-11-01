var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres");
var pgdb = postgres.AddDatabase("pgdb");

var api = builder.AddProject<Projects.SampleContainerApp_Api>("api")
    .WithReference(pgdb);

builder.AddNpmApp("next-app", "../SampleContainerApp.Web")
    .WithReference(api)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
