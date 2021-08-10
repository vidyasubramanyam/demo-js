describe('SwagLabs app', () => {

  it('should be able order swag and do the checkout with batch commands', () => {
    driver.driverScript(
      'await (await driver.$(\'~test-Login\')).waitForDisplayed();\n' +
      '        await driver.setValueImmediate((await driver.$(\'~test-Username\')).elementId,\'standard_user\');\n' +
      '        await driver.setValueImmediate((await driver.$(\'~test-Password\')).elementId,\'secret_sauce\');\n' +
      '        await (await driver.$(\'~test-LOGIN\')).click();\n' +
      '        await (await driver.$(\'~test-PRODUCTS\')).waitForDisplayed();\n' +
      '        await (await driver.$$(\'~test-ADD TO CART\'))[0].click();\n' +
      '        await (await driver.$(\'~test-Cart\')).click();\n' +
      '        await (await driver.$(\'~test-Cart Content\')).waitForDisplayed();\n' +
      '        await (await driver.$(\'~test-CHECKOUT\')).click();\n' +
      '        await (await driver.$(\'~test-Checkout: Your Info\')).waitForDisplayed();\n' +
      '        await driver.setValueImmediate((await driver.$(\'~test-First Name\')).elementId,\'Sauce\');\n' +
      '        await driver.setValueImmediate((await driver.$(\'~test-Last Name\')).elementId,\'Bot\');\n' +
      '        await driver.setValueImmediate((await driver.$(\'~test-Zip/Postal Code\')).elementId,\'1234\');\n' +
      '        await (await driver.$(\'~test-CONTINUE\')).click();\n' +
      '        await (await driver.$(\'~test-CHECKOUT: OVERVIEW\')).waitForDisplayed();\n' +
      '        await (await driver.$(\'~test-FINISH\')).click();\n' +
      '        await (await driver.$(\'~test-CHECKOUT: COMPLETE!\')).waitForDisplayed();'
    );

    // await (await driver.$('~test-Login')).waitForDisplayed();
    // await driver.setValueImmediate((await driver.$('~test-Username')).elementId,'standard_user');
    // await driver.setValueImmediate((await driver.$('~test-Password')).elementId,'secret_sauce');
    // await (await driver.$('~test-LOGIN')).click();
    // await (await driver.$('~test-PRODUCTS')).waitForDisplayed();
    // await (await driver.$$('~test-ADD TO CART'))[0].click();
    // await (await driver.$('~test-Cart')).click();
    // await (await driver.$('~test-Cart Content')).waitForDisplayed();
    // await (await driver.$('~test-CHECKOUT')).click();
    // await (await driver.$('~test-Checkout: Your Info')).waitForDisplayed();
    // await driver.setValueImmediate((await driver.$('~test-First Name')).elementId,'Sauce');
    // await driver.setValueImmediate((await driver.$('~test-Last Name')).elementId,'Bot');
    // await driver.setValueImmediate((await driver.$('~test-Zip/Postal Code')).elementId,'1234');
    // await (await driver.$('~test-CONTINUE')).click();
    // await (await driver.$('~test-CHECKOUT: OVERVIEW')).waitForDisplayed();
    // await (await driver.$('~test-FINISH')).click();
    // await (await driver.$('~test-CHECKOUT: COMPLETE!')).waitForDisplayed();


    // await driver.setImplicitTimeout(10000);
    // await (await driver.$('~test-Login')).waitForDisplayed();
    // await driver.setValueImmediate((await driver.$('~test-Username')).elementId,'standard_user');
    // await driver.setValueImmediate((await driver.$('~test-Password')).elementId,'secret_sauce');
    // await (await driver.$('~test-LOGIN')).click();
    // await (await driver.$('~test-PRODUCTS')).waitForDisplayed();
    // return await (await driver.$('~test-PRODUCTS')).isDisplayed();

    // expect(InventoryListScreen.isShown()).toEqual(true, 'Inventory List screen was not shown');
  });
});
