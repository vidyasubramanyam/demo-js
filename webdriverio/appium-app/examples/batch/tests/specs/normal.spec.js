describe('SwagLabs app', () => {

  it('should be able order swag and do the checkout', () => {
    // Login
    $('~test-Login').waitForDisplayed();
    $('~test-Username').setValue('standard_user');
    $('~test-Password').setValue('secret_sauce');
    $('~test-LOGIN').click();

    // Inventory screen
    $('~test-PRODUCTS').waitForDisplayed();
    $$('~test-ADD TO CART')[0].click();
    $('~test-Cart').click();

    // Cart
    $('~test-Cart Content').waitForDisplayed();
    $('~test-CHECKOUT').click();

    // Personal info
    $('~test-Checkout: Your Info').waitForDisplayed();
    $('~test-First Name').setValue('Sauce');
    $('~test-Last Name').setValue('Bot');
    $('~test-Zip/Postal Code').setValue('1234');
    $('~test-CONTINUE').click();

    // Checkout summary
    $('~test-CHECKOUT: OVERVIEW').waitForDisplayed();
    $('~test-FINISH').click();

    // Finished
    $('~test-CHECKOUT: COMPLETE!').waitForDisplayed();
  });
});
