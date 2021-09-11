import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
 } from './styles';

 export interface DataListProps extends TransactionCardProps {
     id: string;
 }

export function Dashboard() {
    const data: DataListProps[] = [
        { 
            id: '1',
            type: 'positive',
            title: 'Web Dev',
            amount: 'US$ 1,000.00',
            category: {
                name: 'Web Dev',
                icon: 'dollar-sign',
            },
            date: '10/10/2021',
        },
        { 
            id: '2',
            type: 'negative',
            title: '5 Guys',
            amount: 'US$ 10.00',
            category: {
                name: 'Food',
                icon: 'coffee',
            },
            date: '10/10/2021',
        },
        { 
            id: '3',
            type: 'negative',
            title: 'Nike',
            amount: 'US$ 100.00',
            category: {
                name: 'Clothes',
                icon: 'shopping-bag',
            },
            date: '10/10/2021',
        },
    ];

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/32581187?v=4'}}/>
                        <User>
                            <UserGreeting>Hi,</UserGreeting>
                            <UserName>Michel</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>
            </Header>
            <HighlightCards>
                <HighlightCard
                    type="up" 
                    title="Income" 
                    amount="US$ 10,000.00" 
                    lastTransaction="Last transaction September 10th" 
                />
                <HighlightCard 
                    type="down"
                    title="Outcome" 
                    amount="US$ 1,000.00" 
                    lastTransaction="Last transaction September 10th" 
                />
                <HighlightCard
                    type="total" 
                    title="Total" 
                    amount="US$ 9,000.00" 
                    lastTransaction="Last transaction September 10th" 
                />
            </HighlightCards>
            <Transactions>
                <Title>List</Title>
                <TransactionList 
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({item}) =>  <TransactionCard data={item} />}
                />
               
            </Transactions>
            <StatusBar style="auto" />
        </Container>
    )
}
