import json
import datetime

def main():
    print(f"[{datetime.datetime.now()}] 트레이딩 봇 실행을 시작합니다.")

    # 1. GitHub 최상단에 있는 config.json 읽어오기
    try:
        with open('config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
    except FileNotFoundError:
        print("config.json 파일을 찾을 수 없습니다.")
        return

    # 2. 설정값 변수에 할당
    ticker = config.get('ticker')
    ma_days = config.get('moving_average')
    amount = config.get('trade_amount')

    print(f"▶ 현재 설정 - 종목: {ticker}, 기준선: {ma_days}일선, 매수금액: {amount}원")

    # 3. 실제 매매 로직 (여기에 증권사 API 연동 코드가 들어갑니다)
    print("...증권사 API 연결 중...")
    print(f"...{ticker}의 현재가 및 {ma_days}일 이동평균선 조회 중...")
    print(f"...조건 만족 확인! {amount}원어치 시장가 매수 주문 전송 완료!")

if __name__ == "__main__":
    main()
