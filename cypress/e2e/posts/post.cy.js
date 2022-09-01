/// <reference types="cypress" />

describe("Home page", () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: "GET",
        url: "/posts",
      },
      {
        statusCode: 200,
        fixture: "posts.json",
      }
    );
    cy.visit("/");
  });

  it("should render the home page", () => {
    // cy.visit("/")
    // cy.contains("Shaktiman").should("exist");
    // cy.get("#id  .class")
    cy.get(".navbar-brand").should("have.text", "Shaktiman");

    cy.get(".navbar-nav > li").should("have.length", 2);
  });

  it("should render the all compomnents", () => {
    // cy.visit("/")
    cy.get("input").should("exist");
    cy.get(".btn-outline-secondary").should("exist");

    cy.get("table").should("exist");
    cy.get(".btn-danger").should("exist");
  });
  describe("Posts Table", () => {
    it("should render 2 rows", () => {
      cy.get("table > tbody").find("tr").should("have.length", 2);
    });

    it("Each row should have 2 buttons", () => {
      cy.get("table > tbody")
        .find("tr")
        .eq(0)
        .find("td")
        .eq(3)
        .find("button")
        .should("have.length", 2);
    });
    it("should display correct data", () => {
      cy.get("table > tbody")
        .find("tr")
        .eq(0)
        .find("td")
        .eq(0)
        .contains("harry");

      cy.get("table > tbody")
        .find("tr")
        .eq(0)
        .find("td")
        .eq(1)
        .contains("potter1");
    });
  });

  describe("Home Page Actions", () => {
    describe("Search form action", () => {
      it("should filter the table ", () => {
        const fieldVal = "voldemort";
        cy.get("input").type(fieldVal).should("have.value", fieldVal);

        cy.intercept(
          {
            method: "GET",
            url: "/posts?title=" + fieldVal,
          },
          {
            statusCode: 200,
            fixture: "filter-posts.json",
          }
        );
        cy.get(".btn-outline-secondary").click();

        cy.get("table > tbody").find("tr").should("have.length", 1);
      });
    });

    describe("Table action", () => {
        it("should redirect to edit page", () => {
            const id = 2
            cy.intercept(
                {
                  method: "GET",
                  url: "/posts/" + id,
                },
                {
                  statusCode: 200,
                  fixture: "post.json",
                }
              );
            cy.get("table > tbody").find("tr").eq(0).find("td").eq(3).find("button").eq(0).click()
            cy.url().should("include", "posts/"+ id)


            cy.get("#title").should("have.value", "harry");
            cy.get("#description").should("have.value", "potter1");
            
        })
    })
  });
});
