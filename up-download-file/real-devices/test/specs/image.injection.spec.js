import {readFileSync} from 'fs';
import {join} from "path";

describe('Sauce Labs real device file management', () => {
    it('should be able to upload a file to the device with Appium and delete it', () => {
        // Start the Gallary on the device
        driver.startActivity(
            'com.sec.android.gallery3d',
            'com.samsung.android.gallery.app.activity.GalleryActivity',
        );

        // Wait for the Gallery to be there
        $('android=new UiSelector().textContains("No pictures")').waitForDisplayed();

        // Verify that there is no image
        expect(
            $$('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/recycler_view_item")').length
        ).toEqual(0);

        // The file we want to upload
        const codingBot = readFileSync(join(process.cwd(), 'assets/sauce-bot-coding.png'), 'base64');

        // Push it to the device and wait till it is uploaded
        driver.pushFile('/storage/self/primary/sauce-bot-coding.png', codingBot);
        driver.waitUntil(
            () => $$('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/recycler_view_item")').length === 1,
        );

        // Open the image
        $$('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/recycler_view_item")')[0].click();

        // Open delete dialog
        $('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/btn_delete")').waitForDisplayed();
        $('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/btn_delete")').click();

        // Move to bin
        $('android=new UiSelector().textContains("Move to Recycle bin")').waitForDisplayed();
        $('android=new UiSelector().textContains("Move to Recycle bin")').click();

        // Wait until the image is removed and verify that the image is removed
        driver.waitUntil(
            () => $$('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/recycler_view_item")').length === 0
        );
        expect(
            $$('android=new UiSelector().resourceId("com.sec.android.gallery3d:id/recycler_view_item")').length
        ).toEqual(0);
    });
});
