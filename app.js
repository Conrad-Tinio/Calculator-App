let operand_1_value = ''; 
let operand_2_value = '';
let arithmetic_operator = '';
let expression_result = 0; 
let full_expression = ''; 
let enter_val_display_refresh = false;
let expression_exec_refresh = false; 

$(document).ready(function() {

    $('#reset').on('click', function() {
        operand_1_value = '';
        operand_2_value = '';
        arithmetic_operator = '';
        expression_result = 0; 
        full_expression = ''; 

        $('#expression_display').html(''); 
        $('#val_display').html(''); 

        enter_val_display_refresh = false; 
        expression_exec_refresh = false; 
    });

    $('#backspace').on('click', function() {
        if(expression_exec_refresh) {
            operand_1_value = '';
            operand_2_value = '';
            arithmetic_operator = '';
            expression_result = 0; 
            full_expression = ''; 

            $('#expression_display').html('');
            $('#val_display').html('');

            enter_val_display_refresh = false; 
            expression_exec_refresh = false; 
        } else {
            full_expression = full_expression.slice(0, -1); 
            $('#val_display').html(full_expression);
            $('#expression_display').html(full_expression);
        }
    });

    $('#negate').on('click', function() {
        negate_operand();
    }); 

    $('#equal_to').on('click', function() {
        try {
            let result = eval(full_expression); 
            result = Math.round(result * 1e10) / 1e10; 
            $('#expression_display').html(full_expression + ' ='); 
            $('#val_display').html(result); 

            full_expression = result.toString(); 
        } catch (error) {
            $('#val_display').html('Error'); 
            full_expression = '';
        }
        enter_val_display_refresh = true; 
    });

});  

function enter_val(val) {
    if (enter_val_display_refresh) {
        full_expression = '';
        enter_val_display_refresh = false;
    }
    
    if (val === '.') {
        let last_number_match = full_expression.match(/(\d+(\.\d*)?)$/); 
        if (last_number_match && last_number_match[0].includes('.')) {
            return; 
        }
        if (!last_number_match) {
            full_expression += '0'; 
        }
    }

    full_expression += val;  
    $('#val_display').html(full_expression); 
    $('#expression_display').html(full_expression); 
}

function run_operation(operator) {
    enter_val_display_refresh = false;
    
    if (operator === '%') {
        let last_number_match = full_expression.match(/(\d+(\.\d*)?)$/);

        if (last_number_match) {
            let last_number = last_number_match[0];
            let percentage_value = (parseFloat(last_number) / 100).toString(); 

            full_expression = full_expression.replace(last_number, percentage_value);
            $('#val_display').html(full_expression);
            $('#expression_display').html(full_expression);
        }
    } else {
        if (full_expression !== '' && !/[+\-*/]$/.test(full_expression)) { 
            full_expression += operator;  
            $('#val_display').html(full_expression);
            $('#expression_display').html(full_expression);
        }
    }
}

function negate_operand() {
    if (full_expression === '') return;
    
    if (/[+\-*/%]$/.test(full_expression)) return;
    
    let parts = full_expression.split(/([+\-*/%])/);
    
    if (parts.length >= 3) {
        let last_part = parts[parts.length - 1];
        let last_operator = parts[parts.length - 2];
        if (last_part.startsWith('(') && last_part.endsWith(')')) {
            let inner_number = last_part.substring(1, last_part.length - 1);
            let negated_number = (-Number(inner_number)).toString();
            parts[parts.length - 1] = negated_number;
        } else {
            let negated_number = (-Number(last_part)).toString();
            parts[parts.length - 1] = "(" + negated_number + ")";
        }
    } else {
        let negated_number = (-Number(full_expression)).toString();
        parts = [negated_number];
    }

    full_expression = parts.join('');
    
    $('#val_display').html(full_expression);
    $('#expression_display').html(full_expression);
}