# Sprint 2 - *t18* - *Mongoose*

## Goal

### A map and itinerary!
### Sprint Leader: *Hayden Quintana*

## Definition of Done

* Version in pom.xml should be `<version>2.0.0</version>` for your final build for deployment.
* Increment release `v2.0` created on GitHub with appropriate version number and name.
* Increment deployed for testing and demonstration on SPRINT2 assignment.
* Sprint Review and Restrospectives completed (team/sprint2.md).


## Policies

#### Mobile First Design!
* Design for mobile, tablet, laptop, desktop (in that order).
* Use ReactStrap for a consistent interface (no HTML, CSS, style, etc.).
* Must adhere to the TripCo Interchange Protocol (TIP) for interoperability and testing.
#### Clean Code
* Code Climate maintainability of A or B.
* Code adheres to Google style guides for Java and JavaScript.
#### Test Driven Development
* Write method headers, unit tests, and code in that order.
* Unit tests are fully automated.
#### Configuration Management
* Always check for new changes in master to resolve merge conflicts locally before committing them.
* All changes are built and tested before they are committed.
* All commits include a task/issue number.
* All commits include tests for the added or modified code.
* All tests pass.
#### Continuous Integration / Delivery 
* Master is never broken.  If broken, it is fixed immediately.
* Continuous integration successfully builds and tests all pull requests for master branch.
* All Java dependencies in pom.xml.  Do not load external libraries in your repo. 


## Plan

This sprint will complete the following Epics.

* *#69 where am i: TripCo: Show the user their exact location on the home page map if it is available.*
* *#70 vincenty: TripCo: As a company, we have decided to use the Vincenty formula from https://en.wikipedia.org/wiki/Great-circle_distance with the mean earth radius of 3959 miles from https://en.wikipedia.org/wiki/Earth_radius. This allows us to compare results between the various implementations, particularly when we interoperate.*
* *#71 display map and itinerary: User: I want to be able to load a trip itinerary I obtained from another tool so I can see a map of my trip and an updated itinerary that includes the leg and cumulative distances so I know how far I must travel.*
* *#72 geographic coordinate validation: TripCo: All geographic coordinates should be validated, and invalid formats reported to the user in a user-friendly way so the calculator is easy to use.*
* *#73 geographic coordinate formats: User: I want the distance calculator to support many/all formats for geographic coordinates so I can copy/paste them from any source.*
* *#74 short trip: User: I would like the tool to rearrange my trip for me to make it shorter so I have will have less travel time.*


Key planning decisions for this sprint include mutual distribution of tasks, under criterion of number weighted by percieved difficulty. Open communication will need to be held throughout the sprint duration in order to maximize successful integration of different components and keep to the allotted window.


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *value* | *value* |
| Tasks |  *value*   | *value* | 
| Story Points |  *value*  | *value* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *date* | *#task, ...* | *#task, ...* | *none* | 


## Review (focus on solution and technology)

In this sprint, ...

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *## epic title: comments*
* 

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *## epic title: explanation*
*

#### What went well

The ...


#### Problems encountered and resolutions

The ...


## Retrospective (focus on people, process, tools)

In this sprint, ...

#### What we changed this sprint

Our changes for this sprint included ...

#### What we did well

We ...

#### What we need to work on

We could improve ...

#### What we will change next sprint 

We will change ...
