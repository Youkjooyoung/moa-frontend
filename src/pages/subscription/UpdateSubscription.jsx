import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 실제 구현 시에는 옵션 변경 로직 추가

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-4">구독 옵션 변경</h1>
            <p className="text-gray-500 mb-8">현재 변경 가능한 옵션이 없습니다.</p>
            <button
                onClick={() => navigate(`/subscriptions/${id}`)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200"
            >
                돌아가기
            </button>
        </div>
    );
};

export default UpdateSubscription;
