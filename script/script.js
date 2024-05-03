const url   = location.href;

const safetyLevel = "lightblue";
const warningLevel = "khaki";
const dangerLevel = "lightcoral";
const overLimitDate = "5px solid red";
const nearLimitDate = "5px solid yellow";
let accountList = [];

function estimatedExtractNumberInParentheses(str) {
  const regex = /\(([\d.]+)\)/;
  let match = str.match(regex); 
  if (match) {
    let numberInParentheses = parseFloat(match[1]);
    return numberInParentheses;
  }
  return -1; 
}
function actualExtractNumberInParentheses(str) {
  const regex = /\[([\d.]+)\]/;
  let match = str.match(regex); 

  if (match) {
    let numberInParentheses = parseFloat(match[1]);
    return numberInParentheses;
  }
  return -1; 
}
function isNumeric(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

function getSelectedAccount() {
  var selectElement = document.getElementById('accountListSelect');
  var selectedValues = [];
  for (let i = 0; i < selectElement.options.length; i++) {
      var option = selectElement.options[i];
      if (option.selected) {
          selectedValues.push(option.value);
      }
  }
  return selectedValues;
}

function filterAccount() {
  let selectedValues = getSelectedAccount();
  let allCardElements = document.getElementsByClassName("card-user-icon");
  let allCardElementsArray = Array.from(allCardElements);
  
    allCardElementsArray.forEach(function(cardElements) {
      if(selectedValues.length === 0){
        cardElements.parentNode.parentNode.classList.remove("cardFilter");
      }else{
        for(let i=0;i<selectedValues.length;i++){
          if(cardElements.dataset.tooltip==selectedValues[i]){
            cardElements.parentNode.parentNode.classList.remove("cardFilter");
            break;
          }else{
            cardElements.parentNode.parentNode.classList.add("cardFilter");
          }
        }
      }
    });
  
}

if(url.indexOf('backlog.jp/board/')!=-1){
  function boardFunction() {
      let listElements = document.getElementsByClassName("css-hrpltn-col");

      let listElementsArray = Array.from(listElements);

      listElementsArray.forEach(function(element) {
        let titleElements = element.getElementsByClassName("css-e9ni64-box");
        let closeTaskList=false;

        let titleElementsArray = Array.from(titleElements);
        titleElementsArray.forEach(function(titleElements) {
          if(titleElements.tagName == "SPAN" || titleElements.tagName =="span"){
            if(titleElements.innerText=="完了" || titleElements.innerText=="処理済み"){
              closeTaskList=true;
            }
          }
        });

        let cardElements = element.getElementsByClassName("card-summary");

        let cardElementsArray = Array.from(cardElements);
        
        let estimatedSum=0;
        let actualSum=0;

        cardElementsArray.forEach(function(cardElements) {
            let cardClassList=cardElements.parentNode.classList;
            let classCheck=true;
            for(i=0;i<cardClassList.length;i++){
              if(cardClassList[i]=="cardFilter"){
                classCheck=false;
                break;
              }
            }
            if(classCheck){ 
              cardtitle=cardElements.innerHTML;
              let estimatedValue=estimatedExtractNumberInParentheses(cardtitle);
              if(estimatedValue!=-1){
                estimatedSum += estimatedValue;
              }
              let actualValue=actualExtractNumberInParentheses(cardtitle);
              if(actualValue!=-1){
                actualSum += actualValue;
              }
            
              if(estimatedValue!=-1){
                if(actualValue!=-1){
                  if(estimatedValue<actualValue){
                    cardElements.parentNode.style.backgroundColor = dangerLevel;
                  }else if(estimatedValue*0.7<actualValue){
                    cardElements.parentNode.style.backgroundColor = warningLevel;
                  }else{
                    cardElements.parentNode.style.backgroundColor = safetyLevel;
                  }
                }else{
                  cardElements.parentNode.style.backgroundColor = safetyLevel;
                }
              }
            }
            if(!closeTaskList){
              let limitDate=cardElements.parentNode.querySelectorAll('input[aria-label]');
              if(limitDate.length>0){
                let limitDateValue = limitDate[0].value;
                if(limitDateValue.match(/^\d{4}\/\d{2}\/\d{2}$/)){
                  let limitDateValueDate = new Date(limitDateValue);
                  limitDateValueDate.setHours(23);
                  limitDateValueDate.setMinutes(59);
                  let nowDate = new Date();
                  let diffDate = limitDateValueDate - nowDate;
                  if(diffDate<0){
                    cardElements.parentNode.style.border = overLimitDate;
                  }else{
                    let nearLimitDateValue = new Date(limitDateValue);
                    nearLimitDateValue.setHours(23);
                    nearLimitDateValue.setMinutes(59);
                    nearLimitDateValue.setDate(nearLimitDateValue.getDate()-1);
                    diffDate = nearLimitDateValue - nowDate;{
                      if(diffDate<0){
                        cardElements.parentNode.style.border = nearLimitDate;
                      }
                    }
                  }
                }
              }
              let name=cardElements.parentNode.querySelectorAll('button[aria-label="担当者"]')[0].querySelectorAll('img');
              
              let accountlistElement= document.getElementById("accountListSelect");
              if(name.length === 1 && accountList.indexOf(name[0].alt) === -1 && accountlistElement!=null){
                let accountListOption = document.createElement("option");
                accountListOption.value = name[0].alt;
                accountListOption.textContent = name[0].alt;
                accountlistElement.appendChild(accountListOption);
                accountList.push(name[0].alt);
              }
            }
        });

        if(!closeTaskList){
          titleElementsArray.forEach(function(titleElements) {
            if(titleElements.tagName == "SPAN" || titleElements.tagName == "span"){
              let timeElementsScheduledEstimated = titleElements.getElementsByClassName("estimated_time");
              //timeElementsScheduledがなければ要素を追加する
              if(timeElementsScheduledEstimated.length === 0){
                let timeElements = document.createElement("span");
                timeElements.className = "estimated_time";
                timeElements.textContent = "予定:"+estimatedSum;  
                titleElements.appendChild(timeElements);
              }else{
                timeElementsScheduledEstimated[0].textContent = "予定:"+estimatedSum;
              }

              let timeElementsScheduledPunctuation = titleElements.getElementsByClassName("punctuation");
              //punctuationScheduledがなければ要素を追加する
              if(timeElementsScheduledPunctuation.length === 0){
                let timeElements = document.createElement("span");
                timeElements.className = "punctuation";
                timeElements.textContent = "/";  
                titleElements.appendChild(timeElements);
              }

              let timeElementsScheduledActual = titleElements.getElementsByClassName("actual_time");
              //timeElementsScheduledがなければ要素を追加する
              if(timeElementsScheduledActual.length === 0){
                let timeElements = document.createElement("span");
                timeElements.className = "actual_time";
                timeElements.textContent = "実績:"+actualSum;  
                titleElements.appendChild(timeElements);
              }else{
                timeElementsScheduledActual[0].textContent = "実績:"+actualSum;
              }
            }
          });
        }
        let accountFilterDialog = document.createElement("dialog");
        accountFilterDialog.id = "accountFilterDialog";
        let accountListSelect=document.createElement("select");
        accountListSelect.id = "accountListSelect";
        accountListSelect.multiple = "multiple";
        accountListSelect.classList = "accountListSelect";
        accountListSelect.addEventListener("change", function() {
          filterAccount();
        });
        let accountListOptionNotSelect = document.createElement("option");
        accountListOptionNotSelect.value = "未設定";
        accountListOptionNotSelect.textContent = "未設定";
        accountListSelect.appendChild(accountListOptionNotSelect);
        accountFilterDialog.appendChild(accountListSelect);
        let brElement = document.createElement("br");
        accountFilterDialog.appendChild(brElement);
        let accountFilterCloseButton = document.createElement("button");
        accountFilterCloseButton.textContent = "閉じる";
        accountFilterCloseButton.classList ="accountFilterCloseButton"
        accountFilterCloseButton.addEventListener("click", function() {
          let dialog = document.getElementById("accountFilterDialog");
          dialog.close();
        });
        accountFilterDialog.appendChild(accountFilterCloseButton);
        let fileter=document.getElementById("filterButton").parentNode;
        let accountFilterButton = document.getElementById("accountFilterDialog");
        if(fileter!=null && accountFilterButton==null){
          fileter.appendChild(accountFilterDialog);
          let accountFilterButtonElement = document.createElement("button");
          let accountFilterButtonTextElement = document.createElement("span");
          accountFilterButtonTextElement.textContent = "担当者複数選択フィルター";
          accountFilterButtonTextElement.classList = "_assistive-text";
          accountFilterButtonElement.id = "accountFilterButton";
          accountFilterButtonElement.type = "button";
          accountFilterButtonElement.classList = "icon-button icon-button--default title-group__edit-actions-item | simptip-position-top simptip-movable simptip-smooth -with-text"
          accountFilterButtonElement.appendChild(accountFilterButtonTextElement);
          accountFilterButtonElement.addEventListener("click", function() {
            let dialog = document.getElementById("accountFilterDialog");
            dialog.showModal();
          });
          fileter.appendChild(accountFilterButtonElement);
        }
     });
      
  } 

  // 一定時間ごとに関数を呼び出すタイマーを設定
  setInterval(boardFunction, 5000); // 5000ミリ秒ごとに関数が実行される
}

console.log(url);
