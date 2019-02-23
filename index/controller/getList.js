module.exports = async function (obj = {}) {
    const { getListFn, args } = obj;
    const list = await getListFn(...(Object.values(args)));
    // 如果查询出来评论数量等于当前的值，证明没有查询完成
    let isMore = 1;
    if (list.length === args.limit) {
        // 删除最后一条数据
        list.pop();
    } else isMore = 0;
    // 获取回复列表
    return {
        list,
        isMore
    }
}