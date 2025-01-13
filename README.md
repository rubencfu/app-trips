# AppTrips

Here I will leave some notes that may be useful about why I used some things:

## Issues found

- Tags filtering is not working, backend output is 500 internal server error. (tried string and array, communicate with the backend team)

## What is Shared Kernel?

Shared kernel are simple types or utilities that are language-related and can be used anywhere, mainly typescript types that will be used on building blocks

## What are Building Blocks?

Building blocks is a concept where an application is treated as a building. When you want to build something, you need bricks, or pieces.
It is the same thing, I have building blocks that can be used in any typescript project and can be a good base for any app.

For example I have basic abstractions of services, custom exceptions, functions, etc... Also the most important things are Value Objects (as they will simplify a lot the validation work) and the Query system (based on cqrs architecture, I also have a Command system that is simply not needed on this project)

Use cases and services can live along queries and can be implemented easily.

## If This is DDD architecture, why there is not an Application layer?

Well, as DDD is not meant for frontend, and widely used in different forms, is something almost subjective.
I think it makes more sense to unify domain and application in frontend, and create an extra layer called UI or Views, that is where the framework truly resides.

## Another possible DDD Aproach

Another option is to isolate each view in its own Domain and Infrastructure, this means that every view would have its models, services and implementations.
This way, we assure the application to not spread bugs, or to migrate easily to other frameworks or micro-frontends, but code redundance would be bigger.

## Some VSCode Plugins Recommendations

- Angular Language Service
- Prettier
- Tailwind CSS IntelliSense
