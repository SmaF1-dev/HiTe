from .db_services.TestsAPI import TestsAPI
from .db_services.CardsAPI import CardsAPI
from .db_services.HighlightsAPI import HighlightsAPI
from .db_services.ResultsAPI import ResultsAPI

from exceptions.db_exceptions import ObjectNotFound
from settings.Settings import DBSettings

from validation.tests.components.testCard import *
from validation.tests.checkTest import CardAnswer

from .schemas.TestsLogic import *

Tests = TestsAPI(DBSettings.DATABASE_URL)
Cards = CardsAPI(DBSettings.DATABASE_URL)
Highlights = HighlightsAPI(DBSettings.DATABASE_URL)
Results = ResultsAPI(DBSettings.DATABASE_URL)

class TestsLogic():
    def __init__(self) -> None: pass
    
    async def create_test(
            self,
            userId: int,
            title: str,
            description: str,
            questions: List[TestCard]
        ) -> TestDTO:
        added_test = await Tests.add_test(
            title=title,
            authorId=userId,
            description=description,
        )

        for card in questions:
            added_card = await Cards.add_card(
                testId=added_test.testId,
                title=card.title,
                description=card.description,
                isCorrect=card.isCorrect
            )
            for highlight in card.highlight:
                await Highlights.add_highlight(
                    cardId=added_card.cardId,
                    start=highlight.bounds[0],
                    finish=highlight.bounds[1],
                    color=highlight.color
                )
        return TestDTO(
            title=added_test.title,
            testId=added_test.testId
        )

    async def start_test(
            self,
            userId: int,
            testId: int
        ) -> TestTruncatedDTO:
        '''
            ## NOT FULLY IMPLEMENTED!
        '''
        test_info = (await Tests.get_test(
            testId=testId
        ))[0]

        result_table = await Results.add_result_template(
            userId=userId,
            testId=testId
        )

        reencoded_cards: List[TestCardTruncatedDTO] = [
            TestCardTruncatedDTO(
                    title=card.title,
                    description=card.description,
                    cardId=card.cardId,
                )
                for card in
                    await Cards.get_cards(testId=test_info.testId)
        ]
        return TestTruncatedDTO(
            testId=test_info.testId,
            resultIdBypass=result_table.resultId,
            title=test_info.title,
            description=test_info.description,
            questionCards=reencoded_cards
        )

    async def finish_test(
            self,
            testId: int,
            resultIdBypass: int,
            answers: List[CardAnswer]
    ) -> TestFullDTO:
        '''
            ## NOT FULLY IMPLEMENTED!
        '''
        test_info = (await Tests.get_test(
            testId=testId
        ))[0]
        
        reencoded_cards: List[TestCardDTO] = []
        correct_ans_cnt: int = 0

        for answer, card in zip(
            sorted(answers, key = lambda x: x.cardId),
            sorted(await Cards.get_cards(testId=test_info.testId), key = lambda x: x.cardId)
        ):
            if answer.cardId != card.cardId: continue
            
            if answer.answer == card.isCorrect: correct_ans_cnt += 1
            TestCardDTO(
                title=card.title,
                cardId=card.cardId,
                isCorrect=card.isCorrect,
                description=card.description,
                highlight=[
                    CardHighlightDTO(
                        bounds=(elem.start, elem.finish),
                        color=elem.color
                    )
                    for elem in await Highlights.get_highlights(
                        cardId=card.cardId
                    )
                ]
            )
        
        await Results.update_result(
            resultId=resultIdBypass,
            score=correct_ans_cnt
        )

        return TestFullDTO(
            title=test_info.title,
            testId=test_info.testId,
            answers=reencoded_cards,
            result=correct_ans_cnt
        )
    
    async def get_my_results(self, userId: int, start: int, count: int) -> List[ResultDTO]:
        out = await Results.get_result_by_userId(
            userId=userId,
            start=start,
            count=count
        )
        time_extraction = lambda x: None if x is None else round(x.timestamp())
        return [
            ResultDTO(
                testId=result.testId,
                start=round(result.start.timestamp()),
                finish=time_extraction(result.finish),
                score=result.score
            )
            for result in out
        ]
    
    async def get_test_info(self, testId: int) -> TestDTO:
        test_info = (await Tests.get_test(
            testId=testId
        ))[0]
        return TestDTO(
            testId=test_info.testId,
            title=test_info.title
        )