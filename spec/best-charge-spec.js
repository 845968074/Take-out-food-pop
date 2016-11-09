describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function () {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });
  it('should generate best charge when best is 满30减6元', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function () {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

});
describe('Take out CustomTags', function () {

  it('should get customTags', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0001 x 3"];
    let customTags = getCustomsTags(inputs);
    let expected = [
      {
        id: 'ITEM0013',
        count: 4
      },
      {
        id: 'ITEM0001',
        count: 3
      }];
    expect(customTags).toEqual(expected)
  });
});
describe('Take out CustomItems', function () {

  it('should get customItems', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0001 x 3"];
    let customTags = [
      {
        id: 'ITEM0001',
        count: 3
      },
      {
        id: 'ITEM0013',
        count: 4
      },
    ];
    let customItems = getCustomItems(customTags, loadAllItems());
    let expected = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 3
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 4
      }];
    expect(customItems).toEqual(expected)
  });
});
describe('Take out CustomPromotions', function () {

  it('should get customPromtions', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0001 x 3"];
    let customItems = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 3
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 4
      }];
    let customPromotions = getPromotions(customItems, loadPromotions())
    let expected = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 3,
        savedPart: 27,
        totalPrice: 54
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 4,
        savedPart: 0,
        totalPrice: 24
      }];
    expect(customPromotions).toEqual(expected)
  });
});
describe('Take out allPrice', function () {

  it('should get allPrice', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0001 x 3"];
    let customPromotions = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 3,
        savedPart: 27,
        totalPrice: 54
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 4,
        savedPart: 0,
        totalPrice: 24
      }];
    let allPrice = getallPrice(customPromotions);
    let expected =
    {
      savedmoney: 27,
      paymoney: 51,
      type: '指定菜品半价'
    };
    expect(allPrice).toEqual(expected)
  });
});
describe('Take out PromotedItems', function () {

  it('should get Promoteditems', function () {
    let inputs = ["ITEM0013 x 4", "ITEM0001 x 3"];
    let customPromotions = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count: 3,
        savedPart: 27,
        totalPrice: 54
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count: 4,
        savedPart: 0,
        totalPrice: 24
      }];
    let allPrice =
    {
      savedmoney: 27,
      paymoney: 51,
      type: '指定菜品半价'
    };
    let Items = [
      {
        name: '黄焖鸡',
        price: 18.00,
        count: 3,
        savedPart: 27,
        totalPrice: 54
      },
      {
        name: '肉夹馍',
        price: 6.00,
        count: 4,
        savedPart: 0,
        totalPrice: 24
      }];
    let promotedItems = getPromotdItems(customPromotions, allPrice);
    let expected =
    {
      Items,
      allPrice
    };
    expect(promotedItems).toEqual(expected)
  });
});
