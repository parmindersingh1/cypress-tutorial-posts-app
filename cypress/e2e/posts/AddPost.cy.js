/// <reference types="cypress" />

describe("Add Post Page", () => {
  

  describe("Post Form", () => {
    it("should render post form", () => {
      cy.contains("Add").click();

      cy.url().should("include", "/add");
    });

    it("should render all fields", () => {
      cy.get("#title").should("exist");
      cy.get("#description").should("exist");
      cy.get(".btn-success").should("exist");

      cy.contains("something went wrong!").should("not.exist");
      cy.contains("You submitted successfully!").should("not.exist");
    });

    it("should fill fields", () => {
      cy.get("#title").type("harry").should("have.value", "harry");
      cy.get("#description").type("potter").should("have.value", "potter");

    });

    describe("Form Submit", () => {

      beforeEach(() => {
        cy.visit("/add")
      })

      it("should show error message", () => {
        cy.intercept({
          method: "POST",
          url: "/posts"
        }, {
          statusCode: 500,
          fixture: "posts.json"
        })
    
        cy.get(".btn-success").click();
    
        cy.contains("something went wrong!").should("exist");
        cy.get("#title").should("not.exist");
        cy.get("#description").should("not.exist");
    
        cy.get("button[data-testid='submit']").should("not.exist");
      })
    
      it("should show success message", () => {
        cy.intercept({
          method: "POST",
          url: "/posts"
        }, {
          statusCode: 200,
          fixture: "posts.json"
        })
    
        cy.get(".btn-success").click();
    
        cy.contains("You submitted successfully!").should("exist");
        cy.get("#title").should("not.exist");
        cy.get("#description").should("not.exist");
    
        cy.get("button[data-testid='submit']").should("not.exist");
      })
    })
  
  });
});
