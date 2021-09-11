import React, { useState } from 'react';
import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from './styles';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';
import { CategorySelect } from '../../components/Form/CategorySelect';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

export function Register() {
    const [transactionType, setTransactionType] = useState('');

    function handleTransactionTypeSelect (type: 'up'| 'down') {
        setTransactionType(type);
    }

    return (
        <Container>
            <Header>
                <Title>Register</Title>
            </Header>

            <Form>
                <Fields>
                    <Input placeholder="Name" />

                    <Input placeholder="Price" />
                    <TransactionTypes>
                        <TransactionTypeButton
                            isActive={transactionType === 'up'} 
                            type="up"
                            title="Income"
                            onPress={() => handleTransactionTypeSelect('up')}
                        />
                        <TransactionTypeButton
                            isActive={transactionType === 'down'} 
                            type="down"
                            title="Outcome"
                            onPress={() => handleTransactionTypeSelect('down')}
                        />
                    </TransactionTypes>
                    
                    <CategorySelect title="Category" />
                </Fields>

                <Button title="Send" />
            </Form>
         
        </Container>
    )
};