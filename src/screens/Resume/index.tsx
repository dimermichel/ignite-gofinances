import React, { useState, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, format, subMonths } from 'date-fns';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
} from './styles';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { useAuth } from '../../hooks/auth';


interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    const dataKey = `@gofinances:transactions_user:${user.id}`;

    function handleDateChange(action: 'next' | 'prev'){
        if (action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData(){
        setIsLoading(true);
        try {
            const response = await AsyncStorage.getItem(dataKey);
            const responseFormatted = response ? JSON.parse(response) : [];

            const expenses: TransactionData[]  = responseFormatted
                .filter((expense: TransactionData) => 
                expense.type === 'negative' &&
                new Date(expense.date).getMonth() === selectedDate.getMonth() &&
                new Date(expense.date).getFullYear() === selectedDate.getFullYear());
            
            const expensesTotal = expenses.reduce((accum: number, current: TransactionData) => {
                return accum + Number(current.amount);
            }, 0);
            
            const totalByCategory: CategoryData[] = [];

            categories.forEach(category => {
                let categorySum = 0;

                expenses.forEach(item => {
                    if(item.category === category.key){
                        categorySum += Number(item.amount);
                    }
                });

                if (categorySum > 0){
                    const totalFormatted = new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD' 
                    }).format(categorySum);

                    const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`;

                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        color: category.color,
                        total: categorySum,
                        totalFormatted,
                        percent
                    });
                }
            });

            setTotalByCategories(totalByCategory);
        } catch (error) {
            console.log(error);
        } 
        setIsLoading(false);
    }

    useFocusEffect(useCallback(
        () => {
            loadData();
        },
        [selectedDate]
    ));

    return(
        <Container>
            <Header>
                <Title>Summary by category</Title>
            </Header>
            {isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator 
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer>
                ) : (
                
            <Content
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}
                showsVerticalScrollIndicator={false}
            >
            
                <MonthSelect>
                    <MonthSelectButton onPress={() => handleDateChange('prev')}>
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButton>

                    <Month>{format(selectedDate, 'MMMM, yyyy')}</Month>

                    <MonthSelectButton onPress={() => handleDateChange('next')}>
                        <MonthSelectIcon name="chevron-right" />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie 
                        data={totalByCategories}
                        colorScale={totalByCategories.map(item => item.color)}
                        style={{
                            labels: {
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape,
                                }   
                        }}
                        labelRadius={50}
                        x="percent"
                        y="total"
                    />
                </ChartContainer>
                { totalByCategories.map((item) => (
                    <HistoryCard
                        key={`history-${item.key}`} 
                        title={item.name}
                        amount={item.totalFormatted}
                        color={item.color}
                    />
                    ))
                }
            </Content>
            )}
          
        </Container>
    )
}
