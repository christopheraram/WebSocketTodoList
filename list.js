var taskData = new Firebase('https://ca-todo-list.firebaseio.com/tasks');
 
function Item() {
  this.taskName = null;
  this.descritipn = null;
  this.priority = null;
  this.completed = false;
  this.reference = null;
  this.element = null;
}

//Store Varriables, Print and Attach Listeners
taskData.on('child_added', function(snapshot) {

  var item = new Item();
  
  item.taskName = snapshot.val().taskName;
  item.description = snapshot.val().description;
  item.priority = snapshot.val().priority;
  item.completed =snapshot.val().completed;
  item.reference = snapshot.ref();

  item.printItem();
  item.attachListeners();

});


//Print Items
Item.prototype.printItem = function() {

  var task = "<div class='details task'><p>" + this.taskName + "</p></div>";
  var description = "<div class='details description'><p>" + this.description + "</p></div>";
  var priority = "<div class='details priority'><p>" + this.priority + "</p></div>";
  var checkbox = "<div class='details checkbox'><p><input title='Complete' type='checkbox' " + (this.completed ? 'checked' : "") + "/></p></div>";
  var removeItem = "<div class='details remove-button'><p><input type='button' value='Remove' id='removeItem'></p></div>";
        
  var html = "<div class='item'>" + task + description + priority + checkbox + removeItem + "<div class='strikeout'></div></div>";
        
  if (this.completed) { 
    $('#complete').append(html);
    this.element = $('#complete').children().last();
    this.element.css('opacity', '.4');
    //this.element.find('.strikeout').css('display', 'block');
  }
  else {
    $('#incomplete').prepend(html);
    this.element = $('#incomplete').children().first();
  }

};
  
  
//Attach Listeners
Item.prototype.attachListeners = function() {
          
  var item = this;
  
  //Detect a Change in Checkbox Status
  item.element.find('input[type="checkbox"]').on('change', function() {
  
    var checkbox = item.element.find('input[type="checkbox"]');
    
    //checkbox.is returns a boolean
    item.reference.update({completed: checkbox.is(':checked') });

  });


  //On Change of Value change Checkbox State
  item.reference.on('value', function(snapshot) {
  
    if(snapshot.val().completed !== item.completed) {
    
      item.completed = snapshot.val().completed;
    
      item.element.remove();
      item.printItem();
      item.attachListeners();
    }
    
     //item.element.find('input[type="checkbox"]').prop('checked',snapshot.val().completed);
  
  });
  
  //Remove 
  item.element.find('input[type="button"]').on('click',function() {
  
    item.reference.remove();
  
  });
  
  
  //Remove an Item
  item.reference.on('child_removed', function() {
                    
    item.element.remove();
    delete item;
            
  });

};

$(document).ready(function () {
   
       //Create a new Task
    $('#createTask').on("click", function() {
  
      var tempItem = new Item();
      
      tempItem.description  = $('#description').val();
      tempItem.completed = false;
    
      if ($('#taskName').val() !== '') { 
        tempItem.taskName = $('#taskName').val();
         $("#taskName").removeError();
      }
      else { $("#taskName").addError(); }
    
      if ($('#priority').val() !== '') {
        tempItem.priority = $('#priority').val();
        $("#priority").removeError();
      }
      else { $("#priority").addError(); }
    
      //Don't Allow user to Submit Emtpy Lists
      if ( ($('#taskName').val() !== '') && ($('#priority').val() !== '') ) {
        taskData.push({taskName: tempItem.taskName, description: tempItem.description, priority: tempItem.priority, completed: tempItem.completed});
        reset (); // Reset the Form
      }
    
    });
    
    //jQuery Extensions
    $.fn.addError = function() { 
      this.each(function() { 
        $(this).css('border', '2px solid #D82330');
      });
    };

    $.fn.removeError = function() {  
      this.each(function() { 
        $(this).css('border', '');
      });
    };
    
    
    //Resets on Submit
    function reset () {
      $('#priority, #taskName, #description').val('');
    }
   
});
