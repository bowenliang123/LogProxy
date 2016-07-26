'use strict';

const url = require('url');

/**
 * 规则检查器
 */
class RuleChecker {

    constructor(testCases) {
        this.testCases = testCases;

        //解析访问日志规则
        this.pageViewRules = this.parsePageViewRules(testCases);

        //解析点击日志规则
        this.clickRules = this.parseClickRules(testCases);
    }

    parseClickRules(testCases) {
        if (!testCases || testCases.length < 1) {
            return [];
        }

        let clickRules = testCases.filter((testCase)=> {
            return (testCase) && testCase.type == 'click';
        });

        return clickRules;
    }

    parsePageViewRules(testCases) {
        if (!testCases || testCases.length < 1) {
            return [];
        }

        let pageViewRules = testCases.filter((testCase)=> {
            return (testCase) && testCase.type == 'visit';
        });

        return pageViewRules;
    }


    check(targetUrl) {
        let parsedUrl = url.parse(targetUrl, true);   //解析请求


        //检查点击日志规则
        this.checkClickRules(parsedUrl);

        //检查访问日志规则
        this.checkPageViewsRules(parsedUrl);
    }

    /**
     * 点击日志规则
     * @param parsedUrl
     * @param urlGetParams
     */
    checkClickRules(parsedUrl) {
        if (!parsedUrl) {
            return;
        }

        let pathName = parsedUrl.pathname.toLowerCase();
        if (pathName.indexOf('logclick') < 0) {
            return;
        }

        let urlGetParams = parsedUrl.query;    //URL中GET参数键值对
        this.clickRules.forEach((clickRule)=> {
            if (urlGetParams['ck_id'] == clickRule.value) {
                console.log('命中点击规则 【' + clickRule.desc + '】:' + JSON.stringify(clickRule));

                if (!(urlGetParams['pg'] == clickRule.page)) {
                    console.log('缺少 pg=' + clickRule.page);
                }
            }
        });
    }

    /**
     * 访问日志规则检查
     * @param parsedUrl
     * @param urlGetParams
     */
    checkPageViewsRules(parsedUrl) {

        if (!parsedUrl) {
            return;
        }

        let pathName = parsedUrl.pathname.toLowerCase();
        if (pathName.indexOf('logvisit') < 0) {
            return;
        }

        let urlGetParams = parsedUrl.query;    //URL中GET参数键值对
        this.pageViewRules.forEach((pageViewRule)=> {
            if (urlGetParams['pg'] == pageViewRule.page) {
                console.log('命中访问规则 【' + pageViewRule.desc + '】:' + JSON.stringify(pageViewRule));
            }
        });
    }
}

module.exports = RuleChecker