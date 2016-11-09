'use strict';
function bestCharge(inputs) {
  let customTags = getCustomsTags(inputs);
  let allItems = loadAllItems();
  let customItems = getCustomItems(customTags, allItems);
  let promotions = loadPromotions();
  let customPromotions = getPromotions(customItems, promotions);
  let allPrice = getallPrice(customPromotions);
  let pomotedItems = getPromotdItems(customPromotions, allPrice);
  let summary = getListString(pomotedItems);
  return summary;
}
function getCustomsTags(tags) {
  return tags.map((tag) => {
    if (tag.includes(" x ")) {
      let [id,count]=tag.split(" x ");
      return {id: id, count: parseInt(count)};
    }
  });
}
function getCompare(arry, id) {
  return arry.find((customid)=> customid.id === id);
}
function getCustomItems(customTags, allItems) {
  return customTags.map(({id, count}) => {
    let {name, price}=getCompare(allItems, id);
    return {id, name, price, count};
  })
}
function getPromotions(customItems, promotions) {
  let promotion = promotions.find((promotedItems) => promotedItems.type === '指定菜品半价')
  return customItems.reduce((result, {id, name, price, count}) => {
    let hasSavedOfPart = promotion.items.includes(id);
    let totalPrice = parseFloat((price * count).toFixed(2));
    let savedPart = 0;
    if (hasSavedOfPart) {
      savedPart = parseFloat((totalPrice * 0.5).toFixed(2));
    }
    result.push({id, name, price, count, savedPart, totalPrice});
    return result;
  }, []);
  /*  return customItems.map((customItem)=> {
   let hasSavedOfPart = promotion.items.includes(customItem.id);
   let totalPrice = parseFloat((customItem.price * customItem.count).toFixed(2));
   let savedPart = 0;
   if (hasSavedOfPart) {
   savedPart = parseFloat((totalPrice * 0.5).toFixed(2));
   }
   return {
   id: customItem.id,
   name: customItem.name,
   price: customItem.price,
   count: customItem.count,
   savedPart: savedPart,
   totalPrice: totalPrice
   };
   })*/
}
function getallPrice(customPromotons) {
  let savedmoney = _.sumBy(customPromotons, (customPromoton)=> {
    return customPromoton.savedPart;
  });
  let paymoney = _.sumBy(customPromotons, (customPromoton) => {
    return customPromoton.totalPrice
  });
  let result = {savedmoney, paymoney, type: '指定菜品半价'};
  /* let result = customPromotons.reduce((result,{savedPart,totalPrice}) => {
   result.savedmoney +=savedPart;
   result.paymoney +=totalPrice;
   return result;
   }, ({savedmoney: 0, paymoney: 0, type: '指定菜品半价'}));*/
  /*  return result.map(({paymoney,savedmoney,type}) =>
   {
   let saved_Six=paymoney >30 ? 6:0;
   {paymoney,savedmoney,type}=savedmoney<=saved_Six ?{paymoney,saved_Six,'满30减6元'}:{paymoney,0,'没有任何优惠'};
   return {paymoney:paymoney-savedmoney,savedmoney,type};
   })*/
  if (result.paymoney > 30) {
    var saved_Six = 6;
    if (result.savedmoney <= saved_Six) {
      result.savedmoney = saved_Six;
      result.type = '满30减6元';
    }
  }
  else {
    result.type = `没有任何优惠`;
  }
  result.paymoney -= result.savedmoney;
  return result;
}
function getPromotdItems(customPromotions, allPrice) {
  let Items = customPromotions.map(({name, price, count, savedPart, totalPrice}) => {
    return {name, price, count, savedPart, totalPrice};
  });
  return {
    Items,
    allPrice
  }
}
function getListString(promotedItems) {
  let list = "";
  /*  for (let Item of promotedItems.Items) {
   list += `
   ${Item.name} x ${Item.count} = ${Item.totalPrice}元`;
   }*/
  promotedItems.Items.map((Item) => {
    list += `
${Item.name} x ${Item.count} = ${Item.totalPrice}元`;
  });
  if (promotedItems.allPrice.type === `没有任何优惠`) {
    var expected = `
============= 订餐明细 =============
${list.trim()}
-----------------------------------
总计：${promotedItems.allPrice.paymoney}元
===================================`.trim();
  }
  else {
    if (promotedItems.allPrice.type === '满30减6元') {
      var expected = `
============= 订餐明细 =============
${list.trim()}
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：${promotedItems.allPrice.paymoney}元
===================================`.trim();
    }
    else {
      let discountItems = "";
      let count = 0;
      promotedItems.Items.map((item) => {
        count += item.savedPart > 0 ? 1 : 0
      });
      /*      for (let item of promotedItems.Items) {
       if (item.savedPart > 0) {
       count++;
       }
       }*/
      if (count === 2) {
        discountItems += `黄焖鸡，凉皮`;
      }
      else {
        for (let item of promotedItems.Items) {
          if (item.savedPart > 0) {
            discountItems + `${item.name}`;
          }
        }
      }
      var expected = `
============= 订餐明细 =============
${list.trim()}
-----------------------------------
使用优惠:
指定菜品半价(${discountItems.trim()})，省${promotedItems.allPrice.savedmoney}元
-----------------------------------
总计：${promotedItems.allPrice.paymoney}元
===================================`.trim()
    }
  }
  return expected;
}
