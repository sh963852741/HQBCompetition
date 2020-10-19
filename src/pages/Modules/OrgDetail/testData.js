let testData = {
    member: [
        {
            RealName: '岳皓',
            Code: '1001',
            Mobile: '135132648756',
            Email: 'yuehao@163.com',
            Source: '大陆'
        },
        {
            RealName: '宋润涵',
            Code: '2002',
            Mobile: '151254425789',
            Email: 'sh963852741@163.com',
            Source: '大陆'
        },
        {
            RealName: '邵良颖',
            Code: '3004',
            Mobile: '15290830957',
            Email: 'liangyinshao@163.com',
            Source: '大陆'
        }
    ],
    subDept: [
        {
            Name: '办公部',
            DepartType: '思想政治类',
            ParentId: '信息学院团委',
            BirthTime: '2018年5月4日'
        },
        {
            Name: '文娱部',
            DepartType: '文化艺术类',
            ParentId: '信息学院团委',
            BirthTime: '2018年6月4日'
        },
        {
            Name: '外联部',
            DepartType: '社会实践类',
            ParentId: '信息学院团委',
            BirthTime: '2018年7月5日'
        }
    ],
    tutor: [
        {
            Name: '张某某',
            Code: '001',
            Category: '辅导员',
            Status: '中共党员',
            Company: '厦门大学'
        },
        {
            Name: '王某某',
            Code: '002',
            Category: '实验教辅',
            Status: '群众',
            Company: '厦门大学'
        },
        {
            Name: '李某某',
            Code: '003',
            Category: '专业教师',
            Status: '民主党派',
            Company: '厦门大学'
        }
    ],
    manager: [
        {
            Name: '黄某某',
            Mobile: '15103353774',
            Email: 'mouhuang@163.com'
        },
        {
            Name: '方某某',
            Mobile: '13884239590',
            Email: 'moufang@163.com'
        },
        {
            Name: '范某某',
            Mobile: '13995466723',
            Email: 'moufan@163.com'
        }
    ],
    activity: [
        {
            Name: '部门例会',
            Category: '思想政治类',
            Time: '2019年8月1日16:00至18:00',
            Location: '学生公寓201'
        },
        {
            Name: '社团纳新',
            Category: '文化艺术类',
            Time: '2019年10月15日8:00至12:00',
            Location: '学生公寓305'
        },
        {
            Name: '外出比赛',
            Category: '科学理论类',
            Time: '2019年12月11日至2019年12月15日',
            Location: '福建福州'
        }
    ]
};
module.exports = testData;
