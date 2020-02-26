const samples = {
  name: ["Ayo", "Ukeme", "Tobi", "Abasi"],
  phonePrefix: ["081", "080", "070", "090"],
  email: ["sample@hh.com", "a@abc.com", "test@bb.com"],
  address: ["1, tempmail street"],
  landmark: ["ikeja city mall"],
  job: ["farmer", "hunter", "programmer"],
  others: ["abcccc", "efgggggg", "otherss"]
};

const randomizer = type => {
  const typeLength = samples[type].length;
  const index = Math.floor(Math.random() * typeLength);
  return (samples[type][index] || '');
};
const numberGen = (min, max, literial) => {
  min = parseInt(min);
  max = parseInt(max);

  let max_max = 9;
  let min_min = min === 0 ? 0 : 1;
  if (literial) {
    min_min = min;
    min_max = max;
  } else {
    for (let _ = 0; _ < max - 1; _++) {
      max_max += "9";
    }
    if (min) {
      for (let _ = 0; _ < min - 1; _++) {
        min_min += "0";
      }
    }
  }

  return Math.floor(min_min + Math.random() * max_max);
};
const phoneGen = () => {
  return randomizer("phonePrefix") + numberGen(0, 8);
};
const dateGen = () => {
  const year = numberGen(1970, 2090, true);
  const month = numberGen(0, 11, true);
  const day = numberGen(1, 29, true);

  const date = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
  return date;
};
const interceptor = (element, isInput) => {
  setTimeout(() => {
    let event = new Event("change");
    if (isInput) {
      event = new Event("input");
    }
    element.dispatchEvent(event);
  }, 500);
};
// 2020-02-20
const inputEngine = element => {
  interceptor(element, true);
  let labelText = "";
  const elementName = element.name;
  const elementPlaceholder = element.getAttribute("placeholder");
  const elementType = element.getAttribute("type");
  let set = false;

  function test(_text) {
    if (/email/i.test(_text)) {
      element.value = randomizer("email");
      set = true;
    } else if (/(phone)|(bvn)/i.test(_text)) {
      element.value = phoneGen();
      set = true;
    } else if (/fullname/i.test(_text)) {
      element.value = `${randomizer("name")} ${randomizer("name")}`;
      set = true;
    } else if (/name/i.test(_text)) {
      element.value = randomizer("name");
      set = true;
    } else if (/address/i.test(_text)) {
      element.value = randomizer("address");
      set = true;
    } else if (/landmark/i.test(_text)) {
      element.value = randomizer("landmark");
      set = true;
    } else if (/(job)|(occupation)/i.test(_text)) {
      element.value = randomizer("job");
      set = true;
    }
  }

  // checking input type
  switch (elementType) {
    case "email":
      element.value = randomizer("email");
      set = true;
      return;
    case "number":
      element.value = numberGen(
        element.getAttribute("min") || 0,
        element.getAttribute("max") || 1
      );
      set = true;
      return;
    case "date":
      element.value = dateGen();
      set = true;
      return;
    case "file":
      set = true;
      return;
  }

  if (set) {
    return;
  }

  // check the name
  test(elementName);

  if (set) {
    return;
  }

  // check the label

  const parentElement = element.parentElement;

  if (!parentElement) {
    return;
  }
  if (parentElement.nodeName == "LABEL") {
    labelText = parentElement.innerText;
  }

  const label = parentElement.querySelector("label");
  if (label) {
    labelText = label.innerText;
  } else {
    const label2 = parentElement.parentElement.querySelector("label");

    if (label2) {
      labelText = label2.innerText;
    }
  }

  test(labelText);

  if (set) {
    return;
  }

  // use placeholder
  if (elementPlaceholder) {
    element.value = elementPlaceholder;
    set = true
  }
  if(set) {
      return;
  }

  // at this stage chose others
  element.value = randomizer("others");
};
const inputElements = document.querySelectorAll("input");
for (let i = 0; i < inputElements.length; i++) {
  const element = inputElements[i];

  if (element.getAttribute("disabled") == "") {
    continue;
  }
  inputEngine(element);
}

// ----
const selectEngine = (element, selectName) => {
  interceptor(element);
  const options = element.querySelectorAll("option");
  const arr = [];
  options.forEach(option => {
    if(option.value.trim() != '') {
      arr.push(option.value);
    }
 
  });
  const n = "app" + selectName;
  samples[n] = arr;
  element.value = randomizer(n);
  delete samples[n];
};
const selectElements = document.querySelectorAll("select");
for (let i = 0; i < selectElements.length; i++) {
  const element = selectElements[i];

  if (element.getAttribute("disabled") == "") {
    continue;
  }
  selectEngine(element, element.name);
}
