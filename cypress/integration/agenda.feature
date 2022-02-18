Feature: Schedule and consult visits
  It should be possible to consult and schedule visits

Background: go to the agenda page
Given The agenda page is displayed

  Scenario: Entered today
    When go to the agenda page
    Then the username is displayed in the agenda
@focus   
  Scenario Outline: Schedule a visit for another user
    When the username "<username>" is queried
    And a visit is added "<customername>" for today
    Then can see the "<customername>" visit in the list of the today

    Examples:
      | username    | customername |
      | Josep Feliú | AL MISTRAL   |
      | Rubén Lopez | ANLUY        |
