var budgetController = (function() {
   
    var Income = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        
    };
    
    var Expense = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome){
       
        if(totalIncome>0)
            this.percentage = Math.round((this.value/totalIncome)*100);
        
        else
            this.percentage=-1;
    };
    Expense.prototype.getPercentages = function() {
        return this.percentage;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.total[type] = sum;
        
}
        var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        total:{
            exp: 0,
            inc: 0 
        },
        budget:0,
        percentage:-1
    };
    
    
    return {
        addItems: function(type,des,val) {
        var ID,newEntry;
        
        //creating unique ids for the new entries
        if(data.allItems[type].length > 0)
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        else ID=0;
        
        //creating the object according to the type i.e either exp or inc
        if(type === 'exp') {
        newEntry = new Expense(ID,des,val);
        }
        else if(type === 'inc') {
        newEntry = new Income(ID,des,val);
        }
        //pusing the item inside the data structure
        data.allItems[type].push(newEntry);
            console.log(data.allItems[type]);
        
        //returning the new element
        return newEntry;
    
    },
        calculateBudget: function() {
        calculateTotal('inc');
        calculateTotal('exp');
        
        //update budget
        data.budget = data.total.inc - data.total.exp;
            
        
        //percentage calculation
        if(data.total.inc > 0)
        data.percentage = Math.round((data.total.exp/data.total.inc)*100);
        else
            data.percentage=-1; 
    },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            };
        },
        calculatePercentage: function() {
          
            data.allItems.exp.forEach(function(cur) {
               
                cur.calcPercentage(data.total.inc);                          
            });
        },
        getPercentage : function() {
            var percs = data.allItems.exp.map(function(cur) {
                return cur.getPercentages();
            });
            return percs;
        },
        
        
        
        
        deleteItem  : function(type,id) {
            
            var ids=data.allItems[type].map(function(current) {
                return current.id;
            });
            var index = ids.indexOf(id);
                data.allItems[type].splice(index,1);
            
         
        }
      
    };
         
    
        
    })();
var UIcontroller = (function() {
    
    var formatNumber = function(number) {
        var int,dec,splits;
        number = Math.abs(number);
        number = number.toFixed(2);
        splits = number.split('.');
        int = splits[0];
        dec = splits[1];
        if(int.length > 3) {
            int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3)+'.'+dec;
            return int; 
        }
        else
            return number;
        
        
    };
    var nodeList = function(list,callback) {
                for (var i=0;i<list.length;i++) {
                    callback(list[i],i);
                }
            };
            
    
    
    
    
    return {
        getInput: function() {
            return {
             type : document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                value : parseFloat(document.querySelector('.add__value').value)  
                };
            },
    
        addEntryList: function(obj,type) {
            var html,element;
            
            //create a html string with placeholders
            if(type === 'inc'){
                element = '.income__list';
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
                        
            else if (type === 'exp'){
                element = '.expenses__list';
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //insert datas in the place of place holders
            var newHtml;
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value));
            
            //insert the html on dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        deleteEntryList: function (selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
          clearList: function() {
          var fields,fieldsArr;
            
            //selecting the neccessary fields to clear
            fields = document.querySelectorAll('.add__description,.add__value');
            
            //conversion of list into array
            fieldsArr = Array.prototype.slice.call(fields);
            
            //setting the fields to empty  
            fieldsArr.forEach(function(current,index,arr){
            current.value="";
          });
          fieldsArr[0].focus();
          
      },
        displayUI : function(obj) {
            document.querySelector('.budget__income--value').textContent = '+'+formatNumber(obj.totalInc);
            document.querySelector('.budget__expenses--value').textContent = '-'+formatNumber(obj.totalExp);
            if(obj.percentage>0){
                document.querySelector('.budget__expenses--percentage').textContent = obj.percentage+'%';
            }else
                document.querySelector('.budget__expenses--percentage').textContent = '--';
            if(obj.budget > 0)
            document.querySelector('.budget__value').textContent = '+'+formatNumber(obj.budget);
            else
                document.querySelector('.budget__value').textContent = '-'+formatNumber(obj.budget);

                
           
        },
        displayPercentage : function(percentages) {
            var fields = document.querySelectorAll('.item__percentage');
            
            
            nodeList(fields,function(current,index){
                if(percentages[index] > 0)
                    current.textContent = percentages[index]+'%';
                else
                    current.textContent = '--';
                    
            });
        },
        displayMonth : function () {
            var now,year,month;
            var years = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
            now =new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector('.budget__title--month').textContent=years[month] + ' ' + year;
            
        },
           changedType: function() {
            
            var fields = document.querySelectorAll('.add__type,.add__description,.add__value')
            
            nodeList(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector('.add__btn').classList.toggle('red');
            
        },
        
};
    })();
var controller = (function(bgctrl,UIctrl) {
    var data;
    var setEventListeners = function () {
        document.querySelector('.add__btn').addEventListener('click',newItems);
        document.addEventListener('keypress',function(event) {
        if(event.keyCode === 13 )
        newItems();
    });
        document.querySelector('.container').addEventListener('click',deleteCtrl);
        document.querySelector('.add__type').addEventListener('change',UIctrl.changedType);
        
    };
    var updateBudget = function() {
        //update the budget
        bgctrl.calculateBudget();
        
        //get budget
        budget = bgctrl.getBudget();
      
        //display the budgets in UI
        UIctrl.displayUI(budget);
        
    }; 
    var updatePercentages = function() {
        
        bgctrl.calculatePercentage();
        
        var percentages = bgctrl.getPercentage();
       
        
        UIctrl.displayPercentage(percentages);
    };
    
    var newItems = function() {

    //Get the values from the UI
    var input = UIctrl.getInput();

    if(input.description !== "" && input.value>0 && !isNaN(input.value )) {

    //Store the data inside the data structue in bg contl module
    var newEntry = bgctrl.addItems(input.type,input.description,input.value);

    //show it in the UI
    UIctrl.addEntryList(newEntry,input.type);

    //clearList
    UIctrl.clearList();
        
    //update the budget
    updateBudget();
        
    //call update percentages
    updatePercentages();
    

        
    }

  

    
};

    var deleteCtrl = function(event) {
        var splitID,type,ID,ItemId;
        
        splitID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        ItemId=splitID.split('-');
       
        type=ItemId[0];
        ID=ItemId[1];
        
        //updating in the datastructure
        bgctrl.deleteItem(type,parseInt(ID));
        
        //removing it from the UI
        UIctrl.deleteEntryList(splitID);
        
        //updating budget in UI
        updateBudget();
        
        //call update percentges
        updatePercentages();
        
        
  
        
    }
     return {
           init: function() {
            UIctrl.displayMonth();
            UIctrl.displayUI({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
                
            });
            setEventListeners();
        }                          
        };
})(budgetController,UIcontroller);
controller.init();