"use strict";
Parse.Cloud.afterSave('ItemlistedLogs', async (request) => {
    const confirmed = request.object.get('confirmed');
    if (confirmed) {
        const ActiveItem = Parse.Object.extend('ActiveItem');
        // In case of listing update, search for already listed ActiveItem and delete
        const query = new Parse.Query(ActiveItem);
        query.equalTo('nftAddress', request.object.get('nftAddress'));
        query.equalTo('tokenId', request.object.get('tokenId'));
        query.equalTo('marketplaceAddress', request.object.get('address'));
        query.equalTo('seller', request.object.get('seller'));
        const alreadyListedItem = await query.first();
        if (alreadyListedItem) {
            await alreadyListedItem.destroy();
        }
        // Add new ActiveItem
        const activeItem = new ActiveItem();
        activeItem.set('marketplaceAddress', request.object.get('address'));
        activeItem.set('nftAddress', request.object.get('nftAddress'));
        activeItem.set('price', request.object.get('price'));
        activeItem.set('tokenId', request.object.get('tokenId'));
        activeItem.set('seller', request.object.get('seller'));
        console.log(`Adding Address: ${request.object.get('address')} TokenId: ${request.object.get('tokenId')}`);
        console.log('Saving...');
        await activeItem.save();
    }
});
Parse.Cloud.afterSave('ItemcanceledLogs', async (request) => {
    const confirmed = request.object.get('confirmed');
    if (confirmed) {
        const ActiveItem = Parse.Object.extend('ActiveItem');
        const query = new Parse.Query(ActiveItem);
        query.equalTo('marketplaceAddress', request.object.get('address'));
        query.equalTo('nftAddress', request.object.get('nftAddress'));
        query.equalTo('tokenId', request.object.get('tokenId'));
        const canceledItem = await query.first();
        if (canceledItem) {
            await canceledItem.destroy();
        }
    }
});
Parse.Cloud.afterSave('ItemboughtLogs', async (request) => {
    const confirmed = request.object.get('confirmed');
    /// console.log(`Marketplace | Object: ${request.object}`);
    if (confirmed) {
        const ActiveItem = Parse.Object.extend('ActiveItem');
        const query = new Parse.Query(ActiveItem);
        query.equalTo('marketplaceAddress', request.object.get('address'));
        query.equalTo('nftAddress', request.object.get('nftAddress'));
        query.equalTo('tokenId', request.object.get('tokenId'));
        const canceledItem = await query.first();
        if (canceledItem) {
            await canceledItem.destroy();
        }
    }
});
//# sourceMappingURL=updateActiveItems.js.map