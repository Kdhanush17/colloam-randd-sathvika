const Tax = require("../../models/tax");

let taxcal = async (address, postData) => {
  let gsttotaltax = 0.0;
  let gsttaxbreakup = [];
  let gstbaseprice = postData.orderAmount;

  // ✅ Fetch taxes by country & state
  let query = {
    country_code: address.country_code,
    active: true,
  };

  if (address.state) {
    query.$or = [{ state: address.state }, { state: null }, { state: "" }];
  } else {
    query.state = { $in: [null, ""] };
  }

  const taxdata = await Tax.find(query, {
    tax_name: 1,
    type: 1,
    value: 1,
    country_code: 1,
    state: 1,
  }).lean();

  if (!taxdata || taxdata.length === 0) {
    return {
      gsttaxbreakup: [],
      gsttotaltax: 0,
      gstbaseprice,
      finalAmount: gstbaseprice.toFixed(2),
    };
  }

  // ==============================
  // 🔹 COUNTRY-SPECIFIC HANDLING
  // ==============================
  if (address.country_code === "IN") {
    // India GST Logic
    let percentagetax = 0;
    let fixedtax = 0;

    taxdata.forEach((data) => {
      if (data.type === "PERCENTAGE") {
        percentagetax += data.value;
      } else {
        fixedtax += data.value;
      }
    });

    gstbaseprice = postData.orderAmount - fixedtax;
    let pertaxamount = gstbaseprice / (1 + percentagetax / 100);
    gstbaseprice = pertaxamount.toFixed(2);

    taxdata.forEach((data) => {
      if (data.type === "PERCENTAGE") {
        let taxvalue = (gstbaseprice * data.value) / 100;
        data.taxvalue = taxvalue.toFixed(2);
        gsttotaltax += Number(taxvalue.toFixed(2));
      } else {
        data.taxvalue = data.value;
        gsttotaltax += data.value;
      }
      gsttaxbreakup.push(data);
    });

  } else if (address.country_code === "US") {
    // US Sales Tax (state-based only, no federal tax)
    const stateTax = taxdata.find((t) => t.type === "PERCENTAGE");
    if (stateTax) {
      let taxvalue = (gstbaseprice * stateTax.value) / 100;
      stateTax.taxvalue = taxvalue.toFixed(2);
      gsttotaltax = taxvalue;
      gsttaxbreakup.push(stateTax);
    }

  } else if (
    ["DE", "FR", "IT", "ES", "NL", "BE", "EU"].includes(address.country_code)
  ) {
    // EU VAT Countries
    const vat = taxdata.find((t) => t.type === "PERCENTAGE");
    if (vat) {
      let taxvalue = (gstbaseprice * vat.value) / 100;
      vat.taxvalue = taxvalue.toFixed(2);
      gsttotaltax = taxvalue;
      gsttaxbreakup.push(vat);
    }

  } else {
    // Other Countries → Default Calculation
    taxdata.forEach((data) => {
      if (data.type === "PERCENTAGE") {
        let taxvalue = (gstbaseprice * data.value) / 100;
        data.taxvalue = taxvalue.toFixed(2);
        gsttotaltax += Number(taxvalue.toFixed(2));
      } else {
        data.taxvalue = data.value;
        gsttotaltax += data.value;
      }
      gsttaxbreakup.push(data);
    });
  }

  return {
    gsttaxbreakup,
    gsttotaltax: gsttotaltax.toFixed(2),
    gstbaseprice,
    finalAmount: (Number(gstbaseprice) + gsttotaltax).toFixed(2),
  };
};

module.exports = { taxcal };
